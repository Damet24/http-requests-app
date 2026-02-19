import {useState, useMemo} from "react";
import {Modal} from "./Modal";
import {EnvironmentManager} from "./EnvironmentManager";
import {Button, Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger} from "./ui";
import {useWorkspaceStore} from "../../store/workspaceStore";
import {CustomSelect} from "./CustomSelect";

export function EnvironmentSection() {
    const workspace = useWorkspaceStore(s => s.workspace);
    const setActiveEnvironment = useWorkspaceStore(s => s.setActiveEnvironment);

    const options = useMemo(() => {
        return [
            {
                value: "none",
                label: "No Environment",
                color: "text-zinc-400"
            },
            ...workspace.environments.map(env => ({
                value: env.id,
                label: env.name,
                color:
                    env.id === workspace.activeEnvironmentId
                        ? "text-blue-400"
                        : "text-zinc-200"
            }))
        ];
    }, [workspace.environments, workspace.activeEnvironmentId]);

    return (
        <div className="p-4 border-b border-zinc-800 flex gap-2 items-center">

            <CustomSelect
                value={workspace.activeEnvironmentId || ""}
                options={options}
                onChange={setActiveEnvironment}
                className="flex-1 w-full"
            />

            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="ghost">Manage</Button>
                </DialogTrigger>
                <EnvironmentManager/>
            </Dialog>

        </div>
    );
}
