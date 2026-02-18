import { useWorkspaceStore } from "../../store/workspaceStore";
import { CollectionItem } from "./CollectionItem";

export function CollectionsList() {
    const workspace = useWorkspaceStore(s => s.workspace);

    return (
        <div className="space-y-4">
            {workspace.collections.map(collection => (
                <CollectionItem
                    key={collection.id}
                    collection={collection}
                />
            ))}
        </div>
    );
}
