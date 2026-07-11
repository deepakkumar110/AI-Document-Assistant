import { motion } from "framer-motion";
import { Bot } from "lucide-react";
import ChatMessage from "./ChatMessage";

export default function ChatWindow({ messages }) {
  return (
    <div className="flex-1 overflow-y-auto bg-[#0D1B2A] px-8 py-6">

      {messages.length === 0 ? (

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex h-full flex-col items-center justify-center text-center"
        >

          <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-cyan-400 shadow-2xl shadow-cyan-500/30">

            <Bot size={50} className="text-white" />

          </div>

          <h2 className="bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-3xl font-bold text-transparent">
            AI Document Assistant
          </h2>

          <p className="mt-5 max-w-xl text-slate-400 leading-7">
            Upload your PDF and start chatting with your documents
            using AI. Ask questions, summarize content and get
            instant answers.
          </p>

        </motion.div>

      ) : (

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mx-auto max-w-5xl space-y-5"
        >

          {messages.map((msg, index) => (
            <ChatMessage
              key={index}
              sender={msg.sender}
              message={msg.message}
            />
          ))}

        </motion.div>

      )}

    </div>
  );
}