from langchain_community.vectorstores import FAISS
from app.services.embedding_service import get_embedding_model
import os

embeddings = get_embedding_model()


def create_vector_store(chunks):
    print("========== VECTOR STORE ==========")
    print("TOTAL CHUNKS:", len(chunks))

    if not chunks:
        raise ValueError("No chunks generated from PDF.")

    vector_store = FAISS.from_texts(
        texts=chunks,
        embedding=embeddings
    )

    print("Vector Store Created Successfully")
    return vector_store


def save_vector_store(vector_store, path):
    os.makedirs(path, exist_ok=True)
    vector_store.save_local(path)
    print("Vector Store Saved:", path)


def load_vector_store(path):
    return FAISS.load_local(
        path,
        embeddings,
        allow_dangerous_deserialization=True
    )


def store_chunks(chunks, document_id):
    path = f"app/vector_db/{document_id}"

    vector_store = create_vector_store(chunks)

    save_vector_store(vector_store, path)

    return vector_store