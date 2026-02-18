export function RequestPanel() {
    return (
        <div className="border-b border-zinc-800 p-4 space-y-4">

            {/* Method + URL */}
            <div className="flex gap-2">
                <select className="bg-zinc-800 border border-zinc-700 rounded px-3 py-2">
                    <option>GET</option>
                    <option>POST</option>
                    <option>PUT</option>
                    <option>DELETE</option>
                </select>

                <input
                    type="text"
                    placeholder="https://api.example.com"
                    className="flex-1 bg-zinc-800 border border-zinc-700 rounded px-3 py-2"
                />

                <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded font-medium">
                    Send
                </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 border-b border-zinc-800 pb-2 text-sm">
                <button className="text-blue-500">Body</button>
                <button className="text-zinc-400 hover:text-zinc-200">Headers</button>
            </div>

            {/* Body Editor */}
            <textarea
                placeholder="Request body..."
                className="w-full h-32 bg-zinc-800 border border-zinc-700 rounded p-3 font-mono text-sm"
            />
        </div>
    );
}
