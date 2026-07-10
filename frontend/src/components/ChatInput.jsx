import { useState } from "react";
import { Send } from "lucide-react";
import axios from "axios";
import UploadButton from "./UploadButton";

export default function ChatInput({
  messages,
  setMessages,
  setUploadedFile,
}) {
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!question.trim()) return;

    const document_id = localStorage.getItem("document_id");

    console.log("DOCUMENT ID:", document_id);

    if (!document_id || document_id === "undefined") {
      alert("Please upload a PDF first.");
      return;
    }

    const userQuestion = question;

    setMessages((prev) => [
      ...prev,
      {
        sender: "user",
        message: userQuestion,
      },
    ]);

    setQuestion("");
    setLoading(true);

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/pdf/ask",
        null,
        {
          params: {
            document_id: document_id,
            question: userQuestion,
          },
        }
      );

      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          message: response.data.answer,
        },
      ]);
    } catch (error) {
      console.error("ASK ERROR:", error);

      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          message: "❌ Failed to get response from AI.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="border-t border-slate-800 bg-slate-950 p-5">
      <div className="mx-auto flex max-w-5xl items-end gap-3 rounded-2xl border border-slate-700 bg-slate-900 p-3">

        <UploadButton
          setUploadedFile={setUploadedFile}
        />

        <textarea
          rows={1}
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask anything about your PDF..."
          className="flex-1 resize-none bg-transparent p-2 text-white outline-none"
        />

        <button
          onClick={sendMessage}
          disabled={loading}
          className="rounded-full bg-cyan-500 p-3 transition hover:bg-cyan-600 disabled:opacity-50"
        >
          <Send size={20} className="text-white" />
        </button>

      </div>

      {loading && (
        <p className="mt-3 text-center text-sm text-cyan-400">
          🤖 AI is thinking...
        </p>
      )}
    </div>
  );
}