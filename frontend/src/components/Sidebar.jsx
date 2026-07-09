import { useEffect, useState } from "react";
import { Plus, FileText, Bot } from "lucide-react";

export default function Sidebar({ setUploadedFile, setMessages }) {
  const [history, setHistory] = useState([]);

  const loadHistory = () => {
    const data = JSON.parse(localStorage.getItem("pdf_history")) || [];
    setHistory(data);
  };

  useEffect(() => {
    loadHistory();

    const handleStorage = () => {
      loadHistory();
    };

    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  const selectPDF = (pdf) => {
    localStorage.setItem("document_id", pdf.filename);
    localStorage.setItem("current_pdf", pdf.name);

    if (setUploadedFile) {
      setUploadedFile(pdf.name);
    }
  };

  const newChat = () => {
    if (setMessages) {
      setMessages([]);
    }
  };

  return (
    <div className="flex h-screen w-72 flex-col border-r border-slate-800 bg-slate-950">

      {/* Logo */}
      <div className="flex items-center gap-3 border-b border-slate-800 p-6">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500 text-xl font-bold text-white">
          AI
        </div>

        <div>
          <h1 className="text-lg font-bold text-white">
            AI Document
          </h1>
          <p className="text-sm text-gray-400">
            Assistant
          </p>
        </div>
      </div>

      {/* New Chat */}
      <div className="p-5">
        <button
          onClick={newChat}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-500 px-4 py-3 font-semibold text-white transition hover:bg-cyan-600"
        >
          <Plus size={20} />
          New Chat
        </button>
      </div>

      {/* History */}
      <div className="flex-1 overflow-y-auto px-4">

        <p className="mb-3 text-xs uppercase tracking-widest text-gray-500">
          Uploaded PDFs
        </p>

        <div className="space-y-2">

          {history.length === 0 ? (
            <p className="text-sm text-gray-500">
              No PDF uploaded.
            </p>
          ) : (
            history.map((pdf, index) => (
              <button
                key={index}
                onClick={() => selectPDF(pdf)}
                className="flex w-full items-center gap-3 rounded-xl p-3 text-left text-gray-300 transition hover:bg-slate-800"
              >
                <FileText size={18} />
                <span className="truncate">
                  {pdf.name}
                </span>
              </button>
            ))
          )}

        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-slate-800 p-5">
        <div className="flex items-center gap-3 text-gray-400">
          <Bot size={22} />
          <span>Powered by Gemini AI</span>
        </div>
      </div>

    </div>
  );
}