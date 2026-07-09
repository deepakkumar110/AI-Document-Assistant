import { Bot, User } from "lucide-react";

export default function ChatMessage({ message, sender }) {
  const isUser = sender === "user";

  return (
    <div
      className={`mb-6 flex ${
        isUser ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`flex max-w-3xl gap-3 ${
          isUser ? "flex-row-reverse" : "flex-row"
        }`}
      >
        {/* Avatar */}
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-full ${
            isUser
              ? "bg-cyan-500"
              : "bg-slate-800 border border-slate-700"
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
          className={`rounded-2xl px-5 py-4 ${
            isUser
              ? "bg-cyan-500 text-white"
              : "bg-slate-900 border border-slate-800 text-gray-200"
          }`}
        >
          <p className="whitespace-pre-wrap leading-7">
            {message}
          </p>
        </div>
      </div>
    </div>
  );
}