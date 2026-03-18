/**
 * Button — flexible, accessible button with variants
 * Variants: primary | secondary | ghost | danger
 * Sizes:    sm | md | lg
 */

const variants = {
  primary:
    "bg-gradient-to-r from-indigo-500 to-violet-600 text-white shadow-md shadow-indigo-200 hover:shadow-indigo-300 hover:brightness-105",
  secondary:
    "bg-white text-indigo-600 border border-indigo-200 hover:bg-indigo-50 hover:border-indigo-300",
  ghost:
    "bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-800",
  danger:
    "bg-rose-500 text-white hover:bg-rose-600 shadow-md shadow-rose-200",
};

const sizes = {
  sm: "px-3 py-1.5 text-xs rounded-xl gap-1.5",
  md: "px-4 py-2 text-sm rounded-xl gap-2",
  lg: "px-6 py-3 text-base rounded-2xl gap-2",
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  icon: Icon,
  iconPosition = "left",
  loading = false,
  disabled = false,
  className = "",
  ...props
}) {
  return (
    <button
      disabled={disabled || loading}
      className={`
        inline-flex items-center justify-center font-semibold
        transition-all duration-200 select-none
        disabled:opacity-50 disabled:cursor-not-allowed
        active:scale-[0.98]
        ${!disabled && !loading ? "hover:scale-[1.02]" : ""}
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
      {...props}
    >
      {loading ? (
        <svg
          className="animate-spin w-4 h-4 text-current"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v8H4z"
          />
        </svg>
      ) : (
        <>
          {Icon && iconPosition === "left" && <Icon className="shrink-0" />}
          {children}
          {Icon && iconPosition === "right" && <Icon className="shrink-0" />}
        </>
      )}
    </button>
  );
}