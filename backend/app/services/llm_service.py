import os
from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI
from app.services.prompts import SYSTEM_PROMPT

load_dotenv()

llm = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash",
    google_api_key=os.getenv("GOOGLE_API_KEY"),
    temperature=0.2
)


def generate_answer(context, question):

    prompt = f"""
{SYSTEM_PROMPT}

==========================
DOCUMENT CONTEXT
==========================

{context}

==========================
USER QUESTION
==========================

{question}

Remember:
- Use ONLY the provided document.
- If information is missing, clearly say it is not available.
- Use proper Markdown formatting.
- For summaries, use headings.
- For MCQs, use numbered questions with options.
- For key points, use bullet points.
"""

    response = llm.invoke(prompt)

    return response.content