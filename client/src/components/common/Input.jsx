/**
 * Input — accessible, icon-aware text input
 * Props: label, icon (react-icon), error, type, ...rest
 */

export default function Input({
  label,
  id,
  icon: Icon,
  iconRight: IconRight,
  error,
  className = "",
  ...rest
}) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={id}
          className="text-xs font-semibold text-slate-600 uppercase tracking-wide"
        >
          {label}
        </label>
      )}

      <div className="relative group">
        {/* Left icon */}
        {Icon && (
          <span
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors duration-150 pointer-events-none"
            aria-hidden="true"
          >
            <Icon className="text-base" />
          </span>
        )}

        <input
          id={id}
          className={`
            w-full bg-slate-100/60 text-sm text-slate-800 placeholder-slate-400
            rounded-xl px-4 py-2.5 outline-none
            border border-transparent
            focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 focus:bg-white
            transition-all duration-200
            ${Icon ? "pl-10" : ""}
            ${IconRight ? "pr-10" : ""}
            ${error ? "border-rose-300 focus:border-rose-400 focus:ring-rose-100" : ""}
            ${className}
          `}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          {...rest}
        />

        {/* Right icon */}
        {IconRight && (
          <span
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition-colors duration-150"
            aria-hidden="true"
          >
            <IconRight className="text-base" />
          </span>
        )}
      </div>

      {error && (
        <p id={`${id}-error`} role="alert" className="text-xs text-rose-500 mt-0.5">
          {error}
        </p>
      )}
    </div>
  );
}