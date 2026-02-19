import {useWorkspaceStore} from "../../store/workspaceStore";
import {EnvironmentSection} from "./EnvironmentSection";
import {CollectionsList} from "./CollectionsList";
import {SidebarFooter} from "./SidebarFooter";
import {ScrollArea} from "./ui";

export function Sidebar() {
    const workspace = useWorkspaceStore(s => s.workspace);

    if (!workspace) return null;
    const hasCollections = workspace.collections && workspace.collections.length > 0;

    return (
        <div className="h-full flex flex-col border-r border-zinc-800">

                <EnvironmentSection/>

                <ScrollArea className={hasCollections ? "flex-1 min-h-0 overflow-auto p-2" : "p-2"}>

                    <CollectionsList/>

                </ScrollArea>

                <SidebarFooter/>

            </div>
    );
}
