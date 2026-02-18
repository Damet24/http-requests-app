import { useState, useRef, useEffect } from "react";

export function CustomSelect({
                                 value,
                                 options,
                                 onChange,
                                 className = ""
                             }) {
    const [open, setOpen] = useState(false);
    const containerRef = useRef(null);

    // Close on outside click
    useEffect(() => {
        function handleClickOutside(event) {
            if (
                containerRef.current &&
                !containerRef.current.contains(event.target)
            ) {
                setOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const selected = options.find(o => o.value === value);

    return (
        <div
            ref={containerRef}
            className={`relative ${className}`}
        >
            <button
                type="button"
                onClick={() => setOpen(prev => !prev)}
                className="bg-zinc-800 border border-zinc-700 rounded px-3 py-1 w-full text-left flex justify-between items-center"
            >
        <span className={selected?.color}>
          {selected?.label}
        </span>
                <span className="text-zinc-500 text-xs">▾</span>
            </button>

            {open && (
                <div className="absolute z-50 mt-1 w-full bg-zinc-900 border border-zinc-700 rounded shadow-lg overflow-hidden">
                    {options.map(option => (
                        <button
                            key={option.value}
                            onClick={() => {
                                onChange(option.value);
                                setOpen(false);
                            }}
                            className={`w-full text-left px-3 py-2 hover:bg-zinc-800 ${option.color}`}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
