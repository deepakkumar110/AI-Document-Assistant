from app.services.vector_store import search_chunks
from app.services.llm_service import generate_answer
from app.services.prompts import build_prompt


def get_relevant_chunks(
    document_id: str,
    question: str,
    k: int = 3
) -> list[str]:
    """
    Retrieve the most relevant chunks from ChromaDB.
    """

    print("========== RAG RETRIEVAL ==========")
    print("Document ID:", document_id)
    print("Question:", question)

    chunks = search_chunks(
        document_id=document_id,
        query=question,
        k=k
    )

    print("Relevant chunks found:", len(chunks))

    return chunks


def ask_document(document_id: str, question: str) -> str:
    """
    Answer a question using retrieved PDF context and Gemini.
    """

    # Validate inputs
    if not document_id or not document_id.strip():
        raise ValueError("Document ID is required.")

    if not question or not question.strip():
        raise ValueError("Question cannot be empty.")

    question = question.strip()

    # STEP 1: Retrieve relevant chunks
    chunks = get_relevant_chunks(
        document_id=document_id,
        question=question,
        k=3
    )

    # STEP 2: Handle empty retrieval
    if not chunks:
        return (
            "I could not find relevant information in the uploaded PDF. "
            "Please check the document ID or try another question."
        )

    # STEP 3: Prepare document context
    context = "\n\n".join(chunks)

    print("Context prepared successfully.")

    # STEP 4: Build the prompt using prompts.py
    prompt = build_prompt(
        context=context,
        question=question
    )

    # STEP 5: Generate the answer using Gemini
    answer = generate_answer(prompt)

    print("Answer generated successfully.")

    return answer