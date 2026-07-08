from fastapi import APIRouter, UploadFile, File
import aiofiles
import os
import uuid

from app.services.pdf_service import extract_text_from_pdf
from app.services.chunk_service import create_chunks
from app.services.vector_store import store_chunks
from app.services.langgraph_agent import ask_agent

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

    # Extract text
    text = extract_text_from_pdf(file_path)

    # Create chunks
    chunks = create_chunks(text)

    # Save vector store
    store_chunks(
        chunks=chunks,
        document_id=filename
    )

    return {
        "message": "PDF uploaded successfully 🚀",
        "filename": filename,
        "path": file_path,
        "characters": len(text),
        "total_chunks": len(chunks),
        "preview": chunks[0] if chunks else ""
    }


@router.post("/ask")
async def ask_pdf(document_id: str, question: str):

    answer = ask_agent(
        document_id=document_id,
        question=question
    )

    return {
        "question": question,
        "answer": answer
    }