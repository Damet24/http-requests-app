import {useWorkspaceStore} from "../../store/workspaceStore";
import {EnvironmentSection} from "./EnvironmentSection";
import {CollectionsList} from "./CollectionsList";
import {SidebarFooter} from "./SidebarFooter";
import {ScrollArea} from "./ui";

export function Sidebar() {
    const workspace = useWorkspaceStore(s => s.workspace);

    if (!workspace) return null;

    return (
        <ScrollArea className="hidden md:flex h-full min-h-0 flex-col">
            {/*<div className="hidden md:flex h-full min-h-0 border-r border-zinc-800 flex-col">*/}

                <EnvironmentSection/>

                <div className="flex-1 min-h-0 overflow-auto p-2">
                    <CollectionsList/>
                </div>

                <SidebarFooter/>

            {/*</div>*/}
        </ScrollArea>
    );
}
