import { useEffect, useMemo, useState } from "react";
import {
  Plus,
  FileText,
  Bot,
  Search,
  MoreVertical,
} from "lucide-react";
import { motion } from "framer-motion";

export default function Sidebar({ setUploadedFile, setMessages }) {
  const [history, setHistory] = useState([]);
  const [search, setSearch] = useState("");

  const loadHistory = () => {
    const data =
      JSON.parse(localStorage.getItem("pdf_history")) || [];
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

  const filteredHistory = useMemo(() => {
    return history.filter((pdf) =>
      pdf.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [history, search]);

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
    <motion.div
      initial={{ x: -40, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="flex h-screen w-72 flex-col border-r border-slate-700 bg-[#0D1B2A]"
    >
      {/* Logo */}
      <div className="border-b border-slate-700 p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-400 font-bold text-white shadow-lg shadow-cyan-500/30">
            AI
          </div>

          <div>
            <h1 className="text-lg font-bold text-white">
              AI Document
            </h1>

            <p className="text-sm text-slate-400">
              Assistant
            </p>
          </div>
        </div>
      </div>

      {/* New Chat */}
      <div className="p-5">
        <button
          onClick={newChat}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-4 py-3 font-semibold text-white transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-cyan-500/30"
        >
          <Plus size={20} />
          New Chat
        </button>
      </div>

      {/* Search */}
      <div className="px-5 pb-4">
        <div className="relative">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="text"
            placeholder="Search PDFs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-slate-700 bg-[#1E293B] py-3 pl-10 pr-4 text-sm text-white outline-none transition-all duration-300 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
          />
        </div>
      </div>

      {/* History */}
      <div className="flex-1 overflow-y-auto px-4">

        <p className="mb-3 text-xs uppercase tracking-widest text-slate-500">
          Uploaded PDFs
        </p>

        <div className="space-y-2">

          {filteredHistory.length === 0 ? (
            <p className="text-sm text-slate-500">
              No PDF uploaded.
            </p>
          ) : (
            filteredHistory.map((pdf, index) => (
              <motion.button
                key={index}
                whileHover={{
                  scale: 1.02,
                  x: 4,
                }}
                whileTap={{
                  scale: 0.98,
                }}
                onClick={() => selectPDF(pdf)}
                className="group flex w-full items-center justify-between rounded-xl border border-transparent bg-[#1E293B] p-3 text-left text-slate-200 transition-all duration-300 hover:border-cyan-500 hover:bg-[#24364D]"
              >
                <div className="flex items-center gap-3 overflow-hidden">

                  <FileText
                    size={18}
                    className="text-cyan-400"
                  />

                  <span className="truncate">
                    {pdf.name}
                  </span>

                </div>

                <MoreVertical
                  size={18}
                  className="opacity-0 transition-all duration-300 group-hover:opacity-100 text-slate-400"
                />

              </motion.button>
            ))
          )}

        </div>

      </div>

      {/* Bottom */}
      <div className="border-t border-slate-700 p-5">

        <div className="flex items-center gap-3 text-slate-400">

          <Bot
            size={22}
            className="text-cyan-400"
          />

          <span className="text-sm">
            Powered by Gemini AI
          </span>

        </div>

      </div>

    </motion.div>
  );
}