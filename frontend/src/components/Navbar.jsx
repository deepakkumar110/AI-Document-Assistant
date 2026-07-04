

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between px-8 py-5 bg-slate-900 text-white border-b border-slate-800">
      <h1 className="text-2xl font-bold text-cyan-400">
        AI Document Assistant
      </h1>

      <div className="flex items-center gap-8">
        <a href="#" className="hover:text-cyan-400 transition">
          Home
        </a>
        <a href="#" className="hover:text-cyan-400 transition">
          Features
        </a>
        <a href="#" className="hover:text-cyan-400 transition">
          About
        </a>
      </div>

      <button className="px-5 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-600 transition">
        Login
      </button>
    </nav>
  );
}