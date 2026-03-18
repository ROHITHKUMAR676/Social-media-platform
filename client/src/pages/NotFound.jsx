import { FiZap, FiArrowLeft } from "react-icons/fi";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-violet-50 flex items-center justify-center px-4">
      {/* Blobs */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-indigo-200/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-violet-200/30 rounded-full blur-3xl pointer-events-none" />

      <div className="relative text-center flex flex-col items-center gap-5 max-w-sm">
        {/* Logo mark */}
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-xl shadow-indigo-300/40">
          <FiZap className="text-white text-2xl" />
        </div>

        {/* 404 */}
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-indigo-400 mb-2">Error 404</p>
          <h1 className="text-5xl font-black text-slate-800 leading-none mb-3">
            Lost in{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-violet-600">
              space
            </span>
          </h1>
          <p className="text-slate-500 text-sm leading-relaxed">
            This page doesn't exist or was moved. Let's get you back to where the skills are.
          </p>
        </div>

        {/* Decorative orbit */}
        <div className="relative w-32 h-32 my-2">
          <div className="absolute inset-0 rounded-full border-2 border-dashed border-indigo-200 animate-spin" style={{ animationDuration: "12s" }} />
          <div className="absolute inset-4 rounded-full border border-violet-200 animate-spin" style={{ animationDuration: "8s", animationDirection: "reverse" }} />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-4xl">🚀</span>
          </div>
        </div>

        {/* CTA */}
        <a
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-600 text-white text-sm font-bold shadow-md shadow-indigo-200 hover:shadow-indigo-300 hover:scale-[1.03] transition-all duration-200"
        >
          <FiArrowLeft className="text-base" />
          Back to Home
        </a>
      </div>
    </div>
  );
}