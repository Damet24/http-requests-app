import { useWorkspaceStore } from "../../store/workspaceStore";
import { RequestItem } from "./RequestItem";
import { Button } from "./ui/button";
import { useState, useRef, useEffect } from "react";

export function CollectionItem({ collection }) {
    const workspace = useWorkspaceStore(s => s.workspace);
    const createRequest = useWorkspaceStore(s => s.createRequest);
    const updateCollection = useWorkspaceStore(s => s.updateCollection);

    const [isEditing, setIsEditing] = useState(false);
    const [draftName, setDraftName] = useState(collection.name ?? "");
    const [collapsed, setCollapsed] = useState(false);

    const inputRef = useRef(null);

    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
            inputRef.current.select();
        }
    }, [isEditing]);

    const save = () => {
        if (draftName.trim() !== "") {
            updateCollection(collection.id, { name: draftName });
        }
        setIsEditing(false);
    };

    const cancel = () => {
        setDraftName(collection.name);
        setIsEditing(false);
    };

    return (
        <div className="space-y-1">

            {/* Header */}
            <div className="flex justify-between items-center group">

                <div
                    className="flex items-center gap-2 cursor-pointer flex-1"
                    onClick={() => !isEditing && setCollapsed(prev => !prev)}
                >
                    {/* Arrow */}
                    <span
                        className={`text-xs transition-transform duration-200 ${
                            collapsed ? "-rotate-90" : "rotate-0"
                        }`}
                    >
            ▼
          </span>

                    {isEditing ? (
                        <input
                            ref={inputRef}
                            value={draftName}
                            onChange={(e) => setDraftName(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") save();
                                if (e.key === "Escape") cancel();
                            }}
                            onBlur={save}
                            className="bg-zinc-900 border border-zinc-700 rounded px-2 py-0.5 text-sm font-semibold"
                        />
                    ) : (
                        <span
                            onDoubleClick={() => setIsEditing(true)}
                            className="font-semibold text-sm"
                        >
              {collection.name}
            </span>
                    )}
                </div>

                <Button
                    size="sm"
                    variant="ghost"
                    onClick={() =>
                        createRequest(collection.id, "New Request")
                    }
                >
                    + Req
                </Button>

            </div>

            {/* Requests with animation */}
            <div
                className={`overflow-hidden transition-all duration-300 ${
                    collapsed ? "max-h-0 opacity-0" : "max-h-[500px] opacity-100"
                }`}
            >
                <div className="pl-5 space-y-1 mt-1">
                    {collection.requestIds.map(reqId => {
                        const request = workspace.requests.find(
                            r => r.id === reqId
                        );
                        if (!request) return null;

                        return (
                            <RequestItem
                                key={request.id}
                                request={request}
                            />
                        );
                    })}
                </div>
            </div>

        </div>
    );
}
