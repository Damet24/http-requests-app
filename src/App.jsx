import {useEffect} from "react";
import {useWorkspaceStore} from "./store/workspaceStore";
import {Sidebar} from "./ui/components/Sidebar";
import {RequestArea} from "./ui/components/RequestArea";
import {Group, Panel} from "react-resizable-panels";
import {ThemeProvider} from "./ui/components/ThemeProvider";
import {ModeToggle} from "./ui/components/ModeToggle";
import {H1, H3} from "./ui/components/ui";

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
            <div className="h-screen flex flex-col">

                <div className="shrink-0 h-12 border-b dark:border-zinc-800 flex items-center px-4">
                    <h1 className="scroll-m-20 text-center text-2xl font-extrabold tracking-tight text-balance">
                        Reqly
                    </h1>

                    <div className="ml-auto">
                        <ModeToggle/>
                    </div>
                </div>

                <div className="flex-1 min-h-0">
                    <Group direction="horizontal" className="h-full">
                        <Panel defaultSize={25} minSize={15} className="h-full">
                            <Sidebar/>
                        </Panel>

                        <Panel defaultSize={75} className="h-full">
                            <RequestArea/>
                        </Panel>
                    </Group>
                </div>

            </div>
        </ThemeProvider>
    );
}
