from fastapi import APIRouter, UploadFile, File
import aiofiles
import os
import uuid

from app.services.pdf_service import extract_text_from_pdf
from app.services.chunk_service import create_chunks
from app.services.vector_store import store_chunks
from app.services.agent_service import run_agent

router = APIRouter(
    prefix="/pdf",
    tags=["PDF"]
)

UPLOAD_DIR = "app/uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


@router.post("/upload")
async def upload_pdf(file: UploadFile = File(...)):

    if file.content_type != "application/pdf":
        return {"error": "Only PDF files are allowed"}

    filename = f"{uuid.uuid4()}.pdf"
    file_path = os.path.join(UPLOAD_DIR, filename)

    async with aiofiles.open(file_path, "wb") as out_file:
        content = await file.read()
        await out_file.write(content)

    print("========== PDF UPLOAD ==========")

    text = extract_text_from_pdf(file_path)

    print("TEXT LENGTH:", len(text))

    chunks = create_chunks(text)

    print("TOTAL CHUNKS:", len(chunks))

    if len(chunks) == 0:
        return {
            "error": "No text found inside PDF."
        }

    store_chunks(
        chunks=chunks,
        document_id=filename
    )

    print("UPLOAD SUCCESS")

    return {
        "message": "PDF uploaded successfully",
        "filename": filename,
        "path": file_path,
        "characters": len(text),
        "total_chunks": len(chunks)
    }


@router.post("/ask")
async def ask_pdf(document_id: str, question: str):
    answer = run_agent(
        document_id=document_id,
        user_query=question
    )

    return {
        "question": question,
        "answer": answer
    }