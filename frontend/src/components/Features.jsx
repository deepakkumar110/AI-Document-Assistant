
export default function Features() {
  const features = [
    {
      title: "📄 Smart PDF Upload",
      description: "Upload PDF documents securely and analyze them with AI."
    },
    {
      title: "🤖 AI Chat",
      description: "Ask questions in natural language and get intelligent answers."
    },
    {
      title: "🧠 RAG Technology",
      description: "Answers are generated using your document context."
    },
    {
      title: "⚡ AI Agent",
      description: "The AI decides whether to use your PDF or the LLM to answer."
    }
  ];

  return (
    <section className="mx-auto mt-24 max-w-7xl px-6">
      <h2 className="mb-12 text-center text-4xl font-bold text-white">
        Features
      </h2>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {features.map((feature, index) => (
          <div
            key={index}
            className="rounded-2xl bg-slate-900 p-6 transition hover:-translate-y-2 hover:border hover:border-cyan-500"
          >
            <h3 className="mb-4 text-xl font-bold text-cyan-400">
              {feature.title}
            </h3>

            <p className="text-gray-400">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}