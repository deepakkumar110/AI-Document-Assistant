import os
from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI

load_dotenv()

llm = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash",
    google_api_key=os.getenv("GOOGLE_API_KEY"),
    temperature=0.2
)

def generate_answer(context, question):
    prompt = f"""
You are an AI Document Assistant.

Answer ONLY using the context below.

Context:
{context}

Question:
{question}
"""

    response = llm.invoke(prompt)
    return response.content