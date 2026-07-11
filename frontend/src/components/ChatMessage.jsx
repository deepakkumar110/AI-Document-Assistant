import { Bot, User, Copy } from "lucide-react";
import { motion } from "framer-motion";

export default function ChatMessage({ message, sender }) {
  const isUser = sender === "user";

  const copyMessage = () => {
    navigator.clipboard.writeText(message);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={`mb-6 flex ${
        isUser ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`flex max-w-4xl gap-3 ${
          isUser ? "flex-row-reverse" : "flex-row"
        }`}
      >
        {/* Avatar */}
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${
            isUser
              ? "bg-gradient-to-br from-blue-600 to-cyan-500 shadow-lg shadow-cyan-500/30"
              : "border border-slate-700 bg-[#1E293B]"
          }`}
        >
          {isUser ? (
            <User size={18} className="text-white" />
          ) : (
            <Bot size={18} className="text-cyan-400" />
          )}
        </div>

        {/* Message */}
        <div
          className={`group relative rounded-2xl px-5 py-4 shadow-lg transition-all duration-300 ${
            isUser
              ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white"
              : "border border-slate-700 bg-[#1E293B] text-slate-100"
          }`}
        >
          <p className="whitespace-pre-wrap leading-7">
            {message}
          </p>

          {!isUser && (
            <button
              onClick={copyMessage}
              className="absolute right-3 top-3 rounded-lg p-2 text-slate-400 opacity-0 transition-all duration-300 hover:bg-slate-700 hover:text-cyan-400 group-hover:opacity-100"
            >
              <Copy size={16} />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}