import os

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes.pdf import router as pdf_router

load_dotenv()

app = FastAPI(
    title="AI Document Assistant API",
    description="RAG-based PDF Question Answering using ChromaDB and Gemini",
    version="1.0.0",
)

frontend_url = os.getenv("FRONTEND_URL", "").rstrip("/")

allowed_origins = [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:5174",
]

if frontend_url and frontend_url not in allowed_origins:
    allowed_origins.append(frontend_url)

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(pdf_router)


@app.get("/")
def home():
    return {
        "message": "AI Document Assistant Backend is running!",
        "status": "success",
    }


@app.get("/health")
def health_check():
    return {"status": "healthy"}