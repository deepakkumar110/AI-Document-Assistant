# 🤖 AI Document Assistant — LLM + RAG

An AI-powered document assistant that allows users to upload PDF documents and ask questions about their content. The application uses Retrieval-Augmented Generation (RAG) to retrieve relevant information from documents and generate context-based answers using Google's Gemini LLM.

## 🚀 Features

* 📄 Upload PDF documents
* 💬 Ask questions about uploaded documents
* 🧠 AI-powered question answering using Gemini
* 🔍 Semantic search using text embeddings
* 🗄️ Vector storage and retrieval using ChromaDB
* ✂️ Text extraction and chunking
* 📑 Support for extracting text from scanned PDFs using OCR
* ⚡ REST API built with FastAPI
* 🖥️ Interactive frontend built with React

## 🛠️ Tech Stack

### Frontend

* React.js
* JavaScript
* Vite

### Backend

* Python
* FastAPI
* Uvicorn

### Generative AI & RAG

* Google Gemini API
* Retrieval-Augmented Generation (RAG)
* Sentence Transformers
* `all-MiniLM-L6-v2`
* ChromaDB

### PDF Processing

* PyMuPDF
* EasyOCR
* Recursive Character Text Splitting

## 🏗️ Project Architecture

```text
AI Document Assistant
│
├── frontend/
│   ├── src/
│   ├── package.json
│   └── ...
│
├── backend/
│   ├── app/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── uploads/
│   │   ├── ocr_cache/
│   │   └── chroma_db/
│   ├── requirements.txt
│   └── ...
│
└── README.md
```

*Note: The directory structure above is illustrative. Runtime directories such as uploads, OCR cache, and ChromaDB storage may be generated when the application runs.*

## ⚙️ How It Works

1. The user uploads a PDF document.
2. The backend extracts text from the document.
3. The extracted text is divided into smaller chunks.
4. A sentence-transformer model converts the chunks into embeddings.
5. The embeddings and document chunks are stored in ChromaDB.
6. When the user asks a question, the system retrieves relevant chunks.
7. The retrieved context and question are sent to the Gemini model.
8. Gemini generates an answer based on the retrieved document context.
9. The answer is returned to the frontend through the FastAPI API.

## 📋 Prerequisites

Install the following before running the application locally:

* Python 3.10 or a compatible version
* Node.js and npm
* A Google Gemini API key

## 🔧 Backend Setup

### 1. Navigate to the backend directory

```bash
cd backend
```

### 2. Create and activate a virtual environment

Windows PowerShell:

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

### 3. Install dependencies

```bash
pip install -r requirements.txt
```

### 4. Configure environment variables

Create a `.env` file inside the `backend/` directory:

```env
GOOGLE_API_KEY=your_gemini_api_key
```

Replace `your_gemini_api_key` with your actual API key. Never upload the `.env` file or expose your API key publicly.

### 5. Start the backend server

Run this command from the `backend/` directory:

```bash
python -m uvicorn app.main:app --reload
```

Backend URL:

`http://127.0.0.1:8000`

Interactive API documentation:

`http://127.0.0.1:8000/docs`

## 🎨 Frontend Setup

Open another terminal and navigate to the frontend directory:

```bash
cd frontend
```

Install the dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open the local URL displayed in the terminal, usually:

`http://localhost:5173`

Ensure the frontend API configuration points to the running FastAPI backend.

## 🔑 Environment Variables

| Variable         | Description                             |
| ---------------- | --------------------------------------- |
| `GOOGLE_API_KEY` | API key used to access the Gemini model |

Keep all secrets in environment variables. For deployment, configure the API key in the hosting provider's environment settings.

## 🧪 Testing

The backend API can be tested using FastAPI's Swagger UI:

`http://127.0.0.1:8000/docs`

Test the following operations:

* Upload a PDF document.
* Submit a question about the uploaded PDF.
* Verify that relevant document information is retrieved.
* Confirm that the API returns an AI-generated answer.

## 🔒 Security & Data Storage

* Do not commit API keys or `.env` files.
* Uploaded documents may contain sensitive information; handle them responsibly.
* ChromaDB and uploaded files are stored locally during development.
* Production deployments must account for persistent storage, file retention, and API usage limits.

## 🚀 Deployment

The application can be deployed using separate frontend and backend hosting services.

* **Frontend:** A static hosting platform that supports React/Vite.
* **Backend:** A Python hosting platform that supports FastAPI.
* **LLM:** Google's Gemini API.

Configure the deployed backend URL in the frontend and set the required environment variables on the backend hosting platform.

Free hosting plans may have resource limits, cold starts, or temporary storage. Persistent storage may be needed to retain uploaded documents and vector data across restarts.

## 🎯 Project Objective

The objective of this project is to demonstrate how Large Language Models, semantic search, vector databases, and Retrieval-Augmented Generation can be combined to build a practical AI application for document understanding and question answering.

## 👨‍💻 Author

**Deepak Kumar**

B.Tech — Data Science

Interested in Artificial Intelligence, Generative AI, LLMs, RAG, and AI-powered applications.
