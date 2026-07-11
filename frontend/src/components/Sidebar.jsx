import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import {
  Plus,
  FileText,
  Bot,
  Search,
  MoreVertical,
  Trash2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Sidebar({
  setUploadedFile,
  setMessages,
}) {
  const [history, setHistory] = useState([]);
  const [search, setSearch] = useState("");
  const [menuOpen, setMenuOpen] = useState(null);

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
      window.removeEventListener(
        "storage",
        handleStorage
      );
    };
  }, []);

  const filteredHistory = useMemo(() => {
    return history.filter((pdf) =>
      pdf.name
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [history, search]);

  const selectPDF = (pdf) => {
    localStorage.setItem(
      "document_id",
      pdf.filename
    );

    localStorage.setItem(
      "current_pdf",
      pdf.name
    );

    if (setUploadedFile) {
      setUploadedFile(pdf.name);
    }

    setMenuOpen(null);
  };

  const newChat = () => {
    if (setMessages) {
      setMessages([]);
    }
  };

  const deletePDF = (filename) => {
    const oldHistory =
      JSON.parse(
        localStorage.getItem("pdf_history")
      ) || [];

    const updatedHistory = oldHistory.filter(
      (item) => item.filename !== filename
    );

    localStorage.setItem(
      "pdf_history",
      JSON.stringify(updatedHistory)
    );

    if (
      localStorage.getItem("document_id") ===
      filename
    ) {
      localStorage.removeItem("document_id");
      localStorage.removeItem("current_pdf");

      if (setUploadedFile) {
        setUploadedFile(null);
      }

      if (setMessages) {
        setMessages([]);
      }
    }

    setMenuOpen(null);

    loadHistory();

    window.dispatchEvent(
      new Event("storage")
    );
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
            onChange={(e) =>
              setSearch(e.target.value)
            }
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
            filteredHistory.map((pdf) => (
              <div
                key={pdf.filename}
                className="relative group"
              >

                <motion.div
                  whileHover={{
                    scale: 1.02,
                    x: 4,
                  }}
                  whileTap={{
                    scale: 0.98,
                  }}
                  onClick={() => selectPDF(pdf)}
                  className="flex w-full items-center justify-between rounded-xl border border-transparent bg-[#1E293B] p-3 text-left text-slate-200 transition-all duration-300 hover:border-cyan-500 hover:bg-[#24364D] cursor-pointer"
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

                  <button
                    onClick={(e) => {
                      e.stopPropagation();

                      setMenuOpen(
                        menuOpen === pdf.filename
                          ? null
                          : pdf.filename
                      );
                    }}
                    className="rounded-lg p-1 opacity-0 transition-all duration-300 hover:bg-slate-700 group-hover:opacity-100"
                  >
                    <MoreVertical
                      size={18}
                      className="text-slate-400"
                    />
                  </button>

                </motion.div>

                <AnimatePresence>

                  {menuOpen === pdf.filename && (

                    <motion.div
                      initial={{
                        opacity: 0,
                        scale: 0.95,
                        y: -5,
                      }}
                      animate={{
                        opacity: 1,
                        scale: 1,
                        y: 0,
                      }}
                      exit={{
                        opacity: 0,
                        scale: 0.95,
                      }}
                      className="absolute right-2 top-14 z-50 w-36 rounded-xl border border-slate-700 bg-[#1E293B] p-2 shadow-2xl"
                    >

                      <button
                        onClick={() =>
                          deletePDF(pdf.filename)
                        }
                        className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-red-400 transition hover:bg-red-500/10"
                      >

                        <Trash2 size={16} />

                        Delete

                      </button>

                    </motion.div>

                  )}

                </AnimatePresence>

              </div>
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