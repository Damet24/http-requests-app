export function Modal({ open, onClose, children }) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-zinc-900 border border-zinc-800 rounded w-[600px] max-h-[80vh] overflow-auto p-6">
                {children}
            </div>
        </div>
    );
}
