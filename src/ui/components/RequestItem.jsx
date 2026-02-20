import {useWorkspaceStore} from "../../store/workspaceStore";
import {useState, useRef, useEffect} from "react";
import {
    Input,
    ContextMenu,
    ContextMenuTrigger,
    ContextMenuContent,
    ContextMenuGroup,
    ContextMenuItem,
    ContextMenuSeparator,
} from "./ui";
import {MethodColors} from "../../domain/models/constants";

export function RequestItem({request}) {
    const selectedRequestId = useWorkspaceStore(s => s.selectedRequestId);
    const selectRequest = useWorkspaceStore(s => s.selectRequest);
    const updateRequest = useWorkspaceStore(s => s.updateRequest);
    const deleteRequest = useWorkspaceStore(s => s.deleteRequest);
    const duplicateRequest = useWorkspaceStore(s => s.duplicateRequest);

    const [isEditing, setIsEditing] = useState(false);
    const [draftName, setDraftName] = useState(request.name ?? "");

    const inputRef = useRef(null);
    const selected = selectedRequestId === request.id;

    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
            inputRef.current.select();
        }
    }, [isEditing]);

    const save = () => {
        if (draftName.trim() !== "") {
            updateRequest(request.id, {name: draftName});
        }
        setIsEditing(false);
    };

    const cancel = () => {
        setDraftName(request.name);
        setIsEditing(false);
    };

    return (
        <ContextMenu>
            <ContextMenuTrigger asChild>
                <div
                    onClick={() => !isEditing && selectRequest(request.id)}
                    onDoubleClick={() => setIsEditing(true)}
                    className={`flex items-center gap-2 text-sm cursor-pointer px-2 py-1 rounded transition-colors ${
                        selected
                            ? "bg-muted text-foreground"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                >
                    <span className={`text-xs ${MethodColors[request.method]}`}>{request.method}</span>
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
                        <span className="truncate">{request.name}</span>
                    )}
                </div>
            </ContextMenuTrigger>

            <ContextMenuContent>
                <ContextMenuGroup>
                    <ContextMenuItem onSelect={() => setIsEditing(true)}>Rename</ContextMenuItem>
                    <ContextMenuItem onSelect={() => duplicateRequest(request.id)}>Duplicate</ContextMenuItem>
                    <ContextMenuItem
                        onSelect={() => deleteRequest?.(request.id)}
                        className="text-destructive"
                    >
                        Delete
                    </ContextMenuItem>
                </ContextMenuGroup>
            </ContextMenuContent>
        </ContextMenu>
    );
}
