import { useWorkspaceStore } from "../../store/workspaceStore";
import { CollectionItem } from "./CollectionItem";

export function CollectionsList() {
    const workspace = useWorkspaceStore(s => s.workspace);

    return (
        <div>
            {workspace.collections.map(collection => (
                <CollectionItem
                    key={collection.id}
                    collection={collection}
                />
            ))}
        </div>
    );
}
