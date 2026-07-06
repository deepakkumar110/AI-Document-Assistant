
export default function Signup() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4">

      <div className="w-full max-w-md rounded-2xl bg-slate-900 p-8 shadow-xl">

        <h1 className="mb-2 text-center text-3xl font-bold text-cyan-400">
          Create Account
        </h1>

        <p className="mb-8 text-center text-gray-400">
          Join AI Document Assistant
        </p>

        <form className="space-y-5">

          <input
            type="text"
            placeholder="Full Name"
            className="w-full rounded-lg bg-slate-800 p-3 text-white outline-none focus:ring-2 focus:ring-cyan-500"
          />

          <input
            type="email"
            placeholder="Email"
            className="w-full rounded-lg bg-slate-800 p-3 text-white outline-none focus:ring-2 focus:ring-cyan-500"
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full rounded-lg bg-slate-800 p-3 text-white outline-none focus:ring-2 focus:ring-cyan-500"
          />

          <button
            className="w-full rounded-lg bg-cyan-500 py-3 font-semibold transition hover:bg-cyan-600"
          >
            Create Account
          </button>

        </form>

        <p className="mt-6 text-center text-gray-400">
          Already have an account?{" "}
          <span className="cursor-pointer text-cyan-400 hover:underline">
            Login
          </span>
        </p>

      </div>

    </div>
  );
}