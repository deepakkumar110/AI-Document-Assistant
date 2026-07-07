from app.services.vector_store import load_vector_store
from app.services.llm_service import generate_answer


def get_relevant_chunks(document_id, query, k=3):
    vector_store = load_vector_store(f"app/vector_db/{document_id}")

    docs = vector_store.similarity_search(query, k=k)

    return [doc.page_content for doc in docs]


def ask_document(document_id, question):
    chunks = get_relevant_chunks(document_id, question)

    context = "\n\n".join(chunks)

    answer = generate_answer(context, question)

    return answer