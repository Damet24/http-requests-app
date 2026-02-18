import { useWorkspaceStore } from "../../store/workspaceStore";
import { Button } from "./ui/button";

export function SidebarFooter() {
    const createCollection = useWorkspaceStore(s => s.createCollection);

    return (
        <div className="p-3 border-t border-zinc-800">
            <Button
                variant="secondary"
                className="w-full"
                onClick={() => createCollection("New Collection")}
            >
                + New Collection
            </Button>
        </div>
    );
}
