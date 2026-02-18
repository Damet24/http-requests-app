export function ResponsePanel() {
    return (
        <div className="flex-1 p-4 overflow-auto space-y-4">

            {/* Status */}
            <div className="flex gap-4 text-sm">
                <span className="text-green-500 font-medium">200 OK</span>
                <span className="text-zinc-400">123 ms</span>
                <span className="text-zinc-400">1.2 KB</span>
            </div>

            {/* Response Body */}
            <pre className="bg-zinc-800 border border-zinc-700 rounded p-4 text-sm overflow-auto font-mono">
                {`{
    "message": "Hello world"
}`}
      </pre>
        </div>
    );
}
