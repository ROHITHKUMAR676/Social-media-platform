/**
 * Loader — minimal, accessible loading indicator
 * Variants: spinner | dots | pulse | skeleton
 */

export function Spinner({ size = "md", label = "Loading…" }) {
  const sizes = { sm: "w-5 h-5", md: "w-8 h-8", lg: "w-12 h-12" };
  return (
    <span role="status" aria-label={label} className="inline-flex">
      <svg
        className={`animate-spin text-indigo-500 ${sizes[size]}`}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-20"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="3"
        />
        <path
          className="opacity-80"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
        />
      </svg>
    </span>
  );
}

export function Dots({ label = "Loading…" }) {
  return (
    <span role="status" aria-label={label} className="inline-flex items-center gap-1">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce"
          style={{ animationDelay: `${i * 120}ms` }}
        />
      ))}
    </span>
  );
}

export function PostSkeleton() {
  return (
    <div className="bg-white/70 rounded-2xl border border-slate-100 p-4 animate-pulse">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-xl bg-slate-200" />
        <div className="flex flex-col gap-1.5">
          <div className="w-28 h-3 rounded bg-slate-200" />
          <div className="w-16 h-2.5 rounded bg-slate-100" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="w-full h-3 rounded bg-slate-100" />
        <div className="w-5/6 h-3 rounded bg-slate-100" />
        <div className="w-3/4 h-3 rounded bg-slate-100" />
      </div>
      <div className="mt-4 w-full h-36 rounded-xl bg-slate-100" />
      <div className="mt-4 flex gap-2">
        <div className="w-16 h-7 rounded-xl bg-slate-100" />
        <div className="w-16 h-7 rounded-xl bg-slate-100" />
        <div className="w-10 h-7 rounded-xl bg-slate-100" />
      </div>
    </div>
  );
}

/** Full-page overlay loader */
export default function PageLoader() {
  return (
    <div
      role="status"
      aria-label="Loading page"
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-white/80 backdrop-blur-md"
    >
      <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-xl shadow-indigo-300/50 mb-4">
        <svg
          className="animate-spin w-8 h-8 text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="3"
          />
          <path
            className="opacity-80"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          />
        </svg>
      </div>
      <p className="text-sm font-semibold text-slate-500 tracking-wide">Loading…</p>
    </div>
  );
}