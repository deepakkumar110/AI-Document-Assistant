
import Contact from "../../components/Contact";
import Navbar from "../../components/Navbar";
import UploadCard from "../../components/UploadCard";
import Features from "../../components/Features";
import Footer from "../../components/Footer";
import ChatBox from "../../components/ChatBox";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />

      <main className="flex flex-col items-center px-6 py-20 text-center">

        <span className="mb-6 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-2 text-sm text-cyan-400">
          🚀 AI Powered Document Assistant
        </span>

        <h1 className="max-w-4xl text-6xl font-extrabold leading-tight">
          Chat with your <span className="text-cyan-400">PDFs</span> using
          <br />
          RAG + AI Agent
        </h1>

        <p className="mt-8 max-w-2xl text-lg text-gray-400">
          Upload PDF files, ask intelligent questions, and receive accurate
          answers powered by Large Language Models and
          Retrieval-Augmented Generation.
        </p>

        <div className="mt-10 flex gap-4">
          <button className="rounded-xl bg-cyan-500 px-8 py-3 font-semibold transition hover:bg-cyan-600">
            Get Started
          </button>

          <button className="rounded-xl border border-gray-700 px-8 py-3 font-semibold hover:border-cyan-500">
            Learn More
          </button>
        </div>

        <UploadCard />
        <ChatBox />

        <Features />

      </main>

      <Footer />
    </div>
  );
}