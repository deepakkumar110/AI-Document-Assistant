import { useState, useRef } from "react";
import { Send } from "lucide-react";
import { motion } from "framer-motion";
import axios from "axios";
import UploadButton from "./UploadButton";

export default function ChatInput({
  messages,
  setMessages,
  setUploadedFile,
}) {
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const textareaRef = useRef(null);

  const sendMessage = async () => {
    if (!question.trim()) return;

    const document_id = localStorage.getItem("document_id");

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

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    setLoading(true);

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/pdf/ask",
        null,
        {
          params: {
            document_id,
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
      console.error(error);

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
    <div className="border-t border-slate-700 bg-[#0D1B2A] p-5">

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="mx-auto flex max-w-5xl items-end gap-3 rounded-2xl border border-slate-700 bg-[#1E293B] p-3 shadow-xl"
      >

        <UploadButton
          setUploadedFile={setUploadedFile}
        />

        <textarea
          ref={textareaRef}
          rows={1}
          value={question}
          onChange={(e) => {
            setQuestion(e.target.value);

            const ta = textareaRef.current;

            ta.style.height = "auto";
            ta.style.height = `${Math.min(
              ta.scrollHeight,
              180
            )}px`;
          }}
          onKeyDown={handleKeyDown}
          placeholder="Ask anything about your PDF..."
          className="flex-1 resize-none overflow-y-auto bg-transparent p-2 text-white placeholder:text-slate-400 outline-none"
        />
        <button
          onClick={sendMessage}
          disabled={loading}
          className="rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 p-3 text-white transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/30 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{
                repeat: Infinity,
                duration: 1,
                ease: "linear",
              }}
              className="h-5 w-5 rounded-full border-2 border-white border-t-transparent"
            />
          ) : (
            <Send size={20} />
          )}
        </button>

      </motion.div>

      {loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-3 flex items-center justify-center gap-2 text-cyan-400"
        >
          <span>AI is thinking</span>

          <motion.span
            animate={{ opacity: [0.2, 1, 0.2] }}
            transition={{
              repeat: Infinity,
              duration: 1,
            }}
          >
            ●
          </motion.span>

          <motion.span
            animate={{ opacity: [0.2, 1, 0.2] }}
            transition={{
              repeat: Infinity,
              duration: 1,
              delay: 0.2,
            }}
          >
            ●
          </motion.span>

          <motion.span
            animate={{ opacity: [0.2, 1, 0.2] }}
            transition={{
              repeat: Infinity,
              duration: 1,
              delay: 0.4,
            }}
          >
            ●
          </motion.span>
        </motion.div>
      )}

    </div>
  );
}