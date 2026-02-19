import { useWorkspaceStore } from "../../store/workspaceStore";
import { CollectionItem } from "./CollectionItem";
import {ScrollArea} from "./ui";

export function CollectionsList() {
    const workspace = useWorkspaceStore(s => s.workspace);

    return (
        <>
            {workspace.collections.map(collection => (
                <CollectionItem
                    key={collection.id}
                    collection={collection}
                />
            ))}
        </>
    );
}
