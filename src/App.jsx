import {useEffect} from "react";
import {useWorkspaceStore} from "./store/workspaceStore";
import {Sidebar} from "./ui/components/Sidebar";
import {RequestArea} from "./ui/components/RequestArea";
import {Group, Panel} from "react-resizable-panels";
import {ContextMenuProvider} from "./ui/context/ContextMenuContext";
import {ThemeProvider} from "./ui/components/ThemeProvider";
import {ModeToggle} from "./ui/components/ModeToggle";

export function App() {
    const loadWorkspace = useWorkspaceStore(s => s.loadWorkspace);
    const isLoaded = useWorkspaceStore(s => s.isLoaded);

    useEffect(() => {
        loadWorkspace();
    }, []);

    if (!isLoaded) {
        return (
            <div className="h-screen flex items-center justify-center bg-zinc-900 text-zinc-400">
                Loading workspace...
            </div>
        );
    }

    return (
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <ContextMenuProvider>
                <div className="h-screen">
                    {/*<ModeToggle />*/}
                    <Group direction="horizontal">
                        <Panel defaultSize={25} minSize={15}>
                            <Sidebar/>
                        </Panel>
                        <Panel defaultSize={75}>
                            <RequestArea/>
                        </Panel>
                    </Group>
                </div>
            </ContextMenuProvider>
        </ThemeProvider>
    );

}
