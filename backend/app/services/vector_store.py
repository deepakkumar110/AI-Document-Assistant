from langchain_community.vectorstores import FAISS
from app.services.embedding_service import get_embedding_model

# Load embedding model
embeddings = get_embedding_model()


def create_vector_store(chunks):
    """
    Create FAISS vector store from text chunks.
    """
    vector_store = FAISS.from_texts(
        texts=chunks,
        embedding=embeddings
    )
    return vector_store


def save_vector_store(vector_store, path="app/vector_db"):
    """
    Save FAISS vector store to disk.
    """
    vector_store.save_local(path)


def load_vector_store(path="app/vector_db"):
    """
    Load FAISS vector store from disk.
    """
    return FAISS.load_local(
        path,
        embeddings,
        allow_dangerous_deserialization=True
    )


def store_chunks(chunks, document_id):
    """
    Create and save vector store for uploaded document.
    """
    path = f"app/vector_db/{document_id}"