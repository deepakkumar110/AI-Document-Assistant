from app.services.rag_service import ask_document


def search_tool(document_id, question):
    """
    Search inside PDF and answer the user's question.
    """
    return ask_document(document_id, question)


def summary_tool(document_id):
    """
    Generate summary of the uploaded PDF.
    """
    return ask_document(
        document_id,
        "Give a detailed summary of this PDF with proper headings."
    )


def explain_tool(document_id, question):
    """
    Explain a topic from the PDF.
    """
    return ask_document(document_id, question)


def question_tool(document_id):
    """
    Generate important interview questions / MCQs.
    """
    return ask_document(
        document_id,
        "Generate 10 important interview questions with answers from this PDF."
    )


def run_agent(document_id, user_query):
    """
    AI Agent decides which tool to use.
    """

    query = user_query.lower()

    # Summary
    if "summary" in query or "summarize" in query:
        print("Agent → Summary Tool")
        return summary_tool(document_id)

    # Explain
    elif "explain" in query:
        print("Agent → Explain Tool")
        return explain_tool(document_id, user_query)

    # Interview Questions / MCQ
    elif (
        "question" in query
        or "questions" in query
        or "mcq" in query
        or "quiz" in query
        or "interview" in query
    ):
        print("Agent → Question Tool")
        return question_tool(document_id)

    # Default Search
    else:
        print("Agent → Search Tool")
        return search_tool(document_id, user_query)