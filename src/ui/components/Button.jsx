import clsx from "clsx";

export function Button({
                           children,
                           variant = "primary",
                           size = "md",
                           loading = false,
                           disabled = false,
                           className = "",
                           ...props
                       }) {
    const baseStyles =
        "inline-flex items-center justify-center rounded font-medium transition-colors focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed";

    const sizes = {
        sm: "px-3 py-1 text-sm",
        md: "px-4 py-1.5 text-sm",
        lg: "px-5 py-2 text-base"
    };

    const variants = {
        primary:
            "bg-blue-600 hover:bg-blue-700 text-white",
        danger:
            "bg-red-600 hover:bg-red-700 text-white",
        ghost:
            "bg-transparent hover:bg-zinc-800 text-zinc-300",
        secondary:
            "bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700"
    };

    return (
        <button
            className={clsx(
                baseStyles,
                sizes[size],
                variants[variant],
                className
            )}
            disabled={disabled || loading}
            {...props}
        >
            {loading && (
                <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            )}
            {children}
        </button>
    );
}
