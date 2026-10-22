import asyncio
import logging
import uuid
from pathlib import Path

import aiofiles
import fitz

from fastapi import APIRouter, File, HTTPException, UploadFile

from app.services.pdf_service import extract_text_from_pdf
from app.services.chunk_service import create_chunks
from app.services.vector_store import (
    store_chunks,
    delete_document_vectors,
)
from app.services.rag_service import ask_document


router = APIRouter(prefix="/pdf", tags=["PDF"])

logger = logging.getLogger(__name__)

# Application directories
APP_DIR = Path(__file__).resolve().parents[1]
UPLOAD_DIR = APP_DIR / "uploads"

UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

# Read the incoming file in small pieces.
# This is a processing chunk size, NOT a PDF size limit.
UPLOAD_CHUNK_SIZE = 1024 * 1024

# Limit concurrent PDF processing within this application process.
PDF_PROCESSING_LIMIT = asyncio.Semaphore(2)


async def save_and_validate_pdf(
    file: UploadFile,
    destination: Path
) -> int:
    """
    Stream a PDF to disk without imposing a fixed file-size limit.
    Validate its signature and PDF structure.
    """

    total_size = 0
    first_chunk = True

    try:
        async with aiofiles.open(destination, "wb") as output_file:

            while True:
                chunk = await file.read(UPLOAD_CHUNK_SIZE)

                if not chunk:
                    break

                # Validate the beginning of the file.
                if first_chunk:
                    first_chunk = False

                    if not chunk.startswith(b"%PDF-"):
                        raise HTTPException(
                            status_code=400,
                            detail="Invalid PDF file signature."
                        )

                total_size += len(chunk)

                await output_file.write(chunk)

        # Reject empty files.
        if total_size == 0:
            raise HTTPException(
                status_code=400,
                detail="Uploaded PDF is empty."
            )

        # Validate the actual PDF structure.
        try:
            with fitz.open(str(destination)) as document:

                if document.is_encrypted:
                    raise HTTPException(
                        status_code=400,
                        detail=(
                            "Password-protected PDFs "
                            "are not supported."
                        )
                    )

                if document.page_count == 0:
                    raise HTTPException(
                        status_code=400,
                        detail="PDF contains no pages."
                    )

        except HTTPException:
            raise

        except Exception as error:
            raise HTTPException(
                status_code=400,
                detail="PDF is corrupted or cannot be opened."
            ) from error

        return total_size

    except Exception:
        # Remove incomplete uploads.
        if destination.exists():
            destination.unlink()

        raise


@router.post("/upload")
async def upload_pdf(file: UploadFile = File(...)):
    """
    Upload a PDF, extract text, create chunks,
    generate embeddings, and store them in ChromaDB.
    """

    if (
        not file.filename
        or Path(file.filename).suffix.lower() != ".pdf"
    ):
        await file.close()

        raise HTTPException(
            status_code=400,
            detail="Only PDF files are allowed."
        )

    # Generate a unique document ID.
    document_id = f"{uuid.uuid4()}.pdf"
    file_path = UPLOAD_DIR / document_id

    try:
        async with PDF_PROCESSING_LIMIT:

            # STEP 1: Save and validate PDF.
            file_size = await save_and_validate_pdf(
                file=file,
                destination=file_path
            )

            # STEP 2: Extract text, including OCR when needed.
            text = await asyncio.to_thread(
                extract_text_from_pdf,
                str(file_path)
            )

            if not text or not text.strip():
                raise HTTPException(
                    status_code=422,
                    detail="No readable text found in the PDF."
                )

            # STEP 3: Create text chunks.
            chunks = create_chunks(text)

            if not chunks:
                raise HTTPException(
                    status_code=422,
                    detail="Could not create chunks from this PDF."
                )

            # STEP 4: Generate embeddings and store in ChromaDB.
            await asyncio.to_thread(
                store_chunks,
                chunks,
                document_id
            )

        logger.info(
            "PDF processed successfully: id=%s size=%s chunks=%s",
            document_id,
            file_size,
            len(chunks)
        )

        return {
            "message": "PDF uploaded and processed successfully.",
            "document_id": document_id,
            "filename": document_id,
            "file_size_bytes": file_size,
            "characters": len(text),
            "total_chunks": len(chunks)
        }

    except HTTPException:
        if file_path.exists():
            file_path.unlink()

        raise

    except Exception as error:
        logger.exception(
            "PDF processing failed: %s",
            document_id
        )

        # Remove the uploaded file if processing fails.
        if file_path.exists():
            file_path.unlink()

        # Attempt to remove vectors if processing created them.
        try:
            await asyncio.to_thread(
                delete_document_vectors,
                document_id
            )
        except Exception:
            logger.exception(
                "Failed to clean up document vectors."
            )

        raise HTTPException(
            status_code=500,
            detail=(
                "PDF processing failed. "
                "Check the backend logs for details."
            )
        ) from error

    finally:
        await file.close()


@router.post("/ask")
async def ask_pdf(
    document_id: str,
    question: str
):
    """
    Ask a question about an uploaded PDF.
    """

    document_id = document_id.strip()
    question = question.strip()

    if not document_id:
        raise HTTPException(
            status_code=400,
            detail="Document ID is required."
        )

    if not question:
        raise HTTPException(
            status_code=400,
            detail="Question cannot be empty."
        )

    if len(question) > 5000:
        raise HTTPException(
            status_code=422,
            detail="Question cannot exceed 5000 characters."
        )

    try:
        answer = await asyncio.to_thread(
            ask_document,
            document_id,
            question
        )

        return {
            "document_id": document_id,
            "question": question,
            "answer": answer
        }

    except ValueError as error:
        raise HTTPException(
            status_code=400,
            detail=str(error)
        ) from error

    except Exception as error:
        logger.exception(
            "Question answering failed for document %s",
            document_id
        )

        raise HTTPException(
            status_code=500,
            detail=(
                "Failed to generate an answer. "
                "Check the backend logs."
            )
        ) from error