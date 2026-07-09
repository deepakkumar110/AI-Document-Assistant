import ChatMessage from "./ChatMessage";

export default function ChatWindow({ messages }) {
  return (
    <div className="flex-1 overflow-y-auto bg-slate-950 px-8 py-6">

      {messages.length === 0 ? (
        <div className="flex h-full flex-col items-center justify-center text-center">

          <div className="mb-6 text-6xl">
            🤖
          </div>

          <h2 className="text-xl font-bold text-white">
            AI Document Assistant
          </h2>

          <p className="mt-4 max-w-xl text-gray-400">
            Upload a PDF using the + button below and start chatting with
            your document using AI.
          </p>

        </div>
      ) : (
        <div className="mx-auto max-w-5xl">
          {messages.map((msg, index) => (
            <ChatMessage
              key={index}
              sender={msg.sender}
              message={msg.message}
            />
          ))}
        </div>
      )}

    </div>
  );
}