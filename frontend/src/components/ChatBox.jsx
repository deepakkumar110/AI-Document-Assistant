import { useState } from "react";
import axios from "axios";

export default function ChatBox() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const askQuestion = async () => {
    const document_id = localStorage.getItem("document_id");

    if (!document_id) {
      alert("Please upload a PDF first.");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        "http://127.0.0.1:8000/pdf/ask",
        null,
        {
          params: {
            document_id,
            question,
          },
        }
      );

      setAnswer(response.data.answer);
    } catch (error) {
      console.error(error);
      alert("Failed to get answer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-10 w-full max-w-3xl rounded-2xl bg-slate-900 p-8">
      <h2 className="text-2xl font-bold text-white">💬 Ask Your PDF</h2>

      <input
        type="text"
        placeholder="Ask anything about your PDF..."
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        className="mt-5 w-full rounded-lg border border-gray-700 bg-slate-800 p-3 text-white"
      />

      <button
        onClick={askQuestion}
        className="mt-5 rounded-xl bg-cyan-500 px-6 py-3 font-semibold hover:bg-cyan-600"
      >
        {loading ? "Thinking..." : "Ask AI"}
      </button>

      {answer && (
        <div className="mt-6 rounded-xl bg-slate-800 p-5">
          <h3 className="font-bold text-cyan-400">Answer</h3>
          <p className="mt-3 text-gray-300">{answer}</p>
        </div>
      )}
    </div>
  );
}