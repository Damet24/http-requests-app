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
        <ScrollArea className="hidden md:flex h-screen min-h-0 flex-col">
            <div className="flex-1 min-h-0 flex flex-col">

                <EnvironmentSection/>

                <div className={hasCollections ? "flex-1 min-h-0 overflow-auto p-2" : "p-2"}>
                    <CollectionsList/>
                </div>

                <SidebarFooter/>

            </div>
        </ScrollArea>
    );
}
