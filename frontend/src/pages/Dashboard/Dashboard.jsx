
export default function Dashboard() {
  return (
    <div className="flex h-screen bg-slate-950 text-white">

      {/* Sidebar */}
      <aside className="w-72 border-r border-slate-800 bg-slate-900 p-6">

        <h2 className="text-2xl font-bold text-cyan-400">
          AI Assistant
        </h2>

        <button className="mt-8 w-full rounded-lg bg-cyan-500 py-3 font-semibold hover:bg-cyan-600">
          + New Chat
        </button>

        <div className="mt-10">
          <h3 className="mb-3 text-gray-400">
            Recent Chats
          </h3>

          <div className="space-y-3">
            <div className="rounded-lg bg-slate-800 p-3 cursor-pointer hover:bg-slate-700">
              PDF Analysis
            </div>

            <div className="rounded-lg bg-slate-800 p-3 cursor-pointer hover:bg-slate-700">
              Research Paper
            </div>
          </div>
        </div>

      </aside>

      {/* Chat Area */}
      <main className="flex flex-1 flex-col">

        <header className="border-b border-slate-800 p-6">
          <h1 className="text-2xl font-bold">
            AI Document Chat
          </h1>
        </header>

        <div className="flex-1 p-8">
          <div className="rounded-xl bg-slate-900 p-5">
            👋 Welcome! Upload a PDF and start chatting.
          </div>
        </div>

        <div className="border-t border-slate-800 p-6">
          <input
            type="text"
            placeholder="Ask something about your PDF..."
            className="w-full rounded-xl bg-slate-800 p-4 outline-none"
          />
        </div>

      </main>

    </div>
  );
}