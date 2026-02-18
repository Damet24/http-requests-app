import { useWorkspaceStore } from "../../store/workspaceStore";

export function HeadersEditor({ request }) {
    const addHeader = useWorkspaceStore(s => s.addHeader);
    const updateHeader = useWorkspaceStore(s => s.updateHeader);
    const removeHeader = useWorkspaceStore(s => s.removeHeader);

    return (
        <div className="flex flex-col gap-2">

            <div className="grid grid-cols-12 gap-2 text-xs text-zinc-400 px-2">
                <div className="col-span-5">Key</div>
                <div className="col-span-5">Value</div>
                <div className="col-span-2"></div>
            </div>

            {request.headers.map(header => (
                <div
                    key={header.id}
                    className="grid grid-cols-12 gap-2 items-center"
                >
                    <input
                        value={header.key}
                        onChange={(e) =>
                            updateHeader(request.id, header.id, {
                                key: e.target.value
                            })
                        }
                        className="col-span-5 bg-zinc-800 border border-zinc-700 rounded px-2 py-1 text-sm"
                        placeholder="Header name"
                    />

                    <input
                        value={header.value}
                        onChange={(e) =>
                            updateHeader(request.id, header.id, {
                                value: e.target.value
                            })
                        }
                        className="col-span-5 bg-zinc-800 border border-zinc-700 rounded px-2 py-1 text-sm"
                        placeholder="Header value"
                    />

                    <div className="col-span-2 flex gap-2 items-center">
                        <input
                            type="checkbox"
                            checked={header.enabled}
                            onChange={(e) =>
                                updateHeader(request.id, header.id, {
                                    enabled: e.target.checked
                                })
                            }
                        />

                        <button
                            onClick={() =>
                                removeHeader(request.id, header.id)
                            }
                            className="text-red-400 text-xs"
                        >
                            ✕
                        </button>
                    </div>
                </div>
            ))}

            <button
                onClick={() => addHeader(request.id)}
                className="text-blue-400 text-sm mt-2 self-start"
            >
                + Add Header
            </button>
        </div>
    );
}
