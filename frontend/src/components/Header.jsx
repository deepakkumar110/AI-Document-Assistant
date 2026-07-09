import { FileText, Sparkles } from "lucide-react";

export default function Header({ uploadedFile }) {
  return (
    <div className="flex h-20 items-center justify-between border-b border-slate-800 bg-slate-950 px-8">

      {/* Left */}
      <div>
        <h1 className="text-2xl font-bold text-white">
          AI Document Assistant
        </h1>

        <p className="mt-1 flex items-center gap-2 text-sm text-gray-400">
          <FileText size={16} />
          {uploadedFile ? uploadedFile : "No PDF Selected"}
        </p>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2 rounded-xl border border-cyan-500/20 bg-cyan-500/10 px-4 py-2 text-cyan-400">
        <Sparkles size={18} />
        <span className="text-sm font-medium">
          Gemini 2.5 Flash
        </span>
      </div>

    </div>
  );
}