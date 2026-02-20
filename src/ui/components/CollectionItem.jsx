import {useWorkspaceStore} from "../../store/workspaceStore";
import {RequestItem} from "./RequestItem";
import {Button, Input, ContextMenu,
    ContextMenuTrigger,
    ContextMenuContent,
    ContextMenuGroup,
    ContextMenuItem,
    ContextMenuSeparator} from "./ui";
import {useState, useRef, useEffect} from "react";
import {Plus, ChevronDown} from "lucide-react";

export function CollectionItem({ collection }) {
    const workspace = useWorkspaceStore(s => s.workspace);
    const createRequest = useWorkspaceStore(s => s.createRequest);
    const updateCollection = useWorkspaceStore(s => s.updateCollection);
    const deleteCollection = useWorkspaceStore(s => s.deleteCollection);
    const duplicateCollection = useWorkspaceStore(s => s.duplicateCollection);
    const selectCollection = useWorkspaceStore(s => s.selectCollection);
    const selectRequest = useWorkspaceStore(s => s.selectRequest);

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
        <ContextMenu>
            <ContextMenuTrigger asChild>
                <div>
                    {/* Header */}
                    <div className="flex justify-between items-center group cursor-pointer">
                        <div
                            className="flex items-center gap-1 flex-1"
                            onClick={(e) => {
                                e.stopPropagation()
                                selectCollection(collection.id)
                                selectRequest(null)
                            }}
                        >
              <span
                  className={`text-xs transition-transform duration-200 cursor-pointer  ${
                      collapsed ? "-rotate-90" : "rotate-0"
                  }`}
                  onClick={() => !isEditing && setCollapsed(prev => !prev)}
              >
                <ChevronDown size={14} />
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
                                <span
                                    onDoubleClick={() => setIsEditing(true)}
                                    className="font-semibold text-sm"
                                >
                  {collection.name}
                </span>
                            )}
                        </div>

                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                                createRequest(collection.id, "New Request")
                            }
                        >
                            <Plus size={16} />
                        </Button>
                    </div>

                    {/* Requests */}
                    <div
                        className={`overflow-hidden transition-all duration-300 ${
                            collapsed ? "max-h-0 opacity-0" : "max-h-125 opacity-100"
                        }`}
                    >
                        <div className="pl-5 space-y-1">
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
            </ContextMenuTrigger>

            {/* Context Menu */}
            <ContextMenuContent>
                <ContextMenuGroup>
                    <ContextMenuItem onSelect={() => setIsEditing(true)}>
                        Rename
                    </ContextMenuItem>

                    <ContextMenuItem
                        onSelect={() =>
                            createRequest(collection.id, "New Request")
                        }
                    >
                        Add Request
                    </ContextMenuItem>

                    <ContextMenuItem
                        onSelect={() =>
                            duplicateCollection(collection.id)
                        }
                    >
                        Duplicate
                    </ContextMenuItem>

                    <ContextMenuSeparator />

                    <ContextMenuItem
                        onSelect={() =>
                            deleteCollection(collection.id)
                        }
                        className="text-destructive"
                    >
                        Delete
                    </ContextMenuItem>
                </ContextMenuGroup>
            </ContextMenuContent>
        </ContextMenu>
    );
}
