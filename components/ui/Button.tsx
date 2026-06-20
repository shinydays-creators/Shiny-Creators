"use client";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  loading?: boolean;
}

export default function Button({
  children,
  variant = "primary",
  loading = false,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  const base =
    "relative flex items-center justify-center gap-2 font-poppins font-semibold rounded-2xl transition-all duration-200 active:scale-95 disabled:opacity-60 disabled:pointer-events-none";

  const variants = {
    primary: "bg-glow-gold text-glow-text shadow-soft hover:shadow-glow hover:bg-glow-gold-dark px-8 py-4",
    secondary: "bg-glow-pink text-glow-text shadow-soft hover:bg-glow-pink-dark px-8 py-4",
    ghost: "text-glow-text-muted hover:text-glow-text py-3",
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg
          className="animate-spin h-4 w-4 text-current"
          fill="none"
          viewBox="0 0 24 24"
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
            d="M4 12a8 8 0 018-8v8z"
          />
        </svg>
      )}
      {children}
    </button>
  );
}
