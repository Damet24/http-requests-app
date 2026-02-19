import { useWorkspaceStore } from "../../store/workspaceStore";
import { useState, useRef, useEffect } from "react";
import { useContextMenu } from "../context/ContextMenuContext";
import {Input} from "./ui";

const methodColors = {
    GET: "text-green-400",
    POST: "text-blue-400",
    PUT: "text-yellow-400",
    DELETE: "text-red-400"
};

export function RequestItem({ request }) {
    const selectedRequestId = useWorkspaceStore(s => s.selectedRequestId);
    const selectRequest = useWorkspaceStore(s => s.selectRequest);
    const updateRequest = useWorkspaceStore(s => s.updateRequest);
    const { showMenu } = useContextMenu();

    const [isEditing, setIsEditing] = useState(false);
    const [draftName, setDraftName] = useState(request.name ?? "");

    const inputRef = useRef(null);

    const selected = selectedRequestId === request.id;

    // Focus input when editing starts
    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
            inputRef.current.select();
        }
    }, [isEditing]);

    const save = () => {
        if (draftName.trim() !== "") {
            updateRequest(request.id, { name: draftName });
        }
        setIsEditing(false);
    };

    const cancel = () => {
        setDraftName(request.name);
        setIsEditing(false);
    };

    return (
        <div
            onContextMenu={(e) => {
                e.preventDefault();
                showMenu({
                    x: e.clientX,
                    y: e.clientY,
                    items: [
                        {
                            label: "Rename",
                            onClick: () => setIsEditing(true)
                        },
                        {
                            label: "Delete",
                            onClick: () => console.log("delete request")
                        }
                    ]
                });
            }}
            onClick={() => !isEditing && selectRequest(request.id)}
            onDoubleClick={() => setIsEditing(true)}
            className={`flex items-center gap-2 text-sm cursor-pointer px-2 py-1 rounded transition-colors
        ${
                selected
                    ? "bg-zinc-800 text-white"
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800"
            }`}
        >
      <span className={`text-xs ${methodColors[request.method]}`}>
        {request.method}
      </span>

            {isEditing ? (
                <Input
                    ref={inputRef}
                    value={draftName}
                    onChange={(e) => setDraftName(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") save();
                        if (e.key === "Escape") cancel();
                    }}
                    onBlur={save}
                />
            ) : (
                <span className="truncate">
          {request.name}
        </span>
            )}
        </div>
    );
}
