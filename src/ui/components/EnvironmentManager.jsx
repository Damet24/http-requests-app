import {useWorkspaceStore} from "../../store/workspaceStore";
import {useState} from "react";
import {
    Button,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    Field,
    FieldGroup,
    Input,
    Label, ScrollArea,
} from "./ui";
import {Plus, Trash2} from "lucide-react";

export function EnvironmentManager() {
    const workspace = useWorkspaceStore((s) => s.workspace);
    const createEnvironment = useWorkspaceStore((s) => s.createEnvironment);
    const updateEnvironment = useWorkspaceStore((s) => s.updateEnvironment);
    const deleteEnvironment = useWorkspaceStore((s) => s.deleteEnvironment);

    const [selectedEnvId, setSelectedEnvId] = useState(
        workspace.activeEnvironmentId
    );

    const selectedEnv = workspace.environments.find(
        (e) => e.id === selectedEnvId
    );

    return (
        <DialogContent className="sm:max-w-175">
            <DialogHeader>
                <DialogTitle>Manage Environments</DialogTitle>
                <DialogDescription>
                    Create, update or delete environments and variables.
                </DialogDescription>
            </DialogHeader>


            <div className="flex gap-6 py-4">
                <div className="w-48 space-y-2 border-r pr-4">
                    <ScrollArea className="h-100">
                        {workspace.environments.map((env) => (
                            <Button
                                key={env.id}
                                variant={selectedEnvId === env.id ? "secondary" : "ghost"}
                                className="w-full justify-start"
                                onClick={() => setSelectedEnvId(env.id)}
                            >
                                {env.name}
                            </Button>
                        ))}
                    </ScrollArea>

                    <Button
                        className="w-full"
                        onClick={() => createEnvironment("New Environment")}
                    >
                        <Plus /> New
                    </Button>
                </div>

                {selectedEnv && (
                    <div className="flex-1 space-y-4">
                        <FieldGroup>
                            <Field>
                                <Label>Environment Name</Label>
                                <Input
                                    value={selectedEnv.name}
                                    onChange={(e) =>
                                        updateEnvironment(selectedEnv.id, {
                                            name: e.target.value,
                                        })
                                    }
                                />
                            </Field>
                        </FieldGroup>

                        <div className="space-y-3">
                            {selectedEnv.variables.map((v, index) => (
                                <FieldGroup key={index}>
                                    <div className="flex gap-2">
                                        <Input
                                            placeholder="key"
                                            value={v.key}
                                            onChange={(e) => {
                                                const updated = [...selectedEnv.variables];
                                                updated[index].key = e.target.value;
                                                updateEnvironment(selectedEnv.id, {
                                                    variables: updated,
                                                });
                                            }}
                                        />

                                        <Input
                                            placeholder="value"
                                            value={v.value}
                                            onChange={(e) => {
                                                const updated = [...selectedEnv.variables];
                                                updated[index].value = e.target.value;
                                                updateEnvironment(selectedEnv.id, {
                                                    variables: updated,
                                                });
                                            }}
                                        />
                                    </div>
                                </FieldGroup>
                            ))}

                            <div className="flex gap-2">
                            <Button
                                variant="outline"
                                onClick={() =>
                                    updateEnvironment(selectedEnv.id, {
                                        variables: [
                                            ...selectedEnv.variables,
                                            {key: "", value: ""},
                                        ],
                                    })
                                }
                            >
                                <Plus /> Add Variable
                            </Button>

                            <Button
                                variant="destructive"
                                onClick={() => deleteEnvironment(selectedEnv.id)}
                            >
                                <Trash2 /> Delete Environment
                            </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <DialogFooter>
                <DialogClose asChild>
                    <Button>Done</Button>
                </DialogClose>

            </DialogFooter>
        </DialogContent>
    );
}
