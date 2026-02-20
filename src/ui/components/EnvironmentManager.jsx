import { useWorkspaceStore } from "../../store/workspaceStore";
import { useState, useEffect } from "react";
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
    Label,
    ScrollArea,
    Switch
} from "./ui";
import { Plus, Trash2 } from "lucide-react";

export function EnvironmentManager() {
    const workspace = useWorkspaceStore((s) => s.workspace);

    const createEnvironment = useWorkspaceStore((s) => s.createEnvironment);
    const updateEnvironment = useWorkspaceStore((s) => s.updateEnvironment);
    const deleteEnvironment = useWorkspaceStore((s) => s.deleteEnvironment);

    const addEnvironmentVariable = useWorkspaceStore(
        (s) => s.addEnvironmentVariable
    );
    const updateEnvironmentVariable = useWorkspaceStore(
        (s) => s.updateEnvironmentVariable
    );
    const deleteEnvironmentVariable = useWorkspaceStore(
        (s) => s.deleteEnvironmentVariable
    );

    const [selectedEnvId, setSelectedEnvId] = useState(
        workspace?.activeEnvironmentId
    );

    useEffect(() => {
        if (!selectedEnvId && workspace?.environments?.length > 0) {
            setSelectedEnvId(workspace.environments[0].id);
        }
    }, [workspace]);

    const selectedEnv = workspace?.environments?.find(
        (e) => e.id === selectedEnvId
    );

    if (!workspace) return null;

    return (
        <DialogContent className="sm:max-w-175">
            <DialogHeader>
                <DialogTitle>Manage Environments</DialogTitle>
                <DialogDescription>
                    Create, update or delete environments and variables.
                </DialogDescription>
            </DialogHeader>

            <div className="flex gap-6 py-4">
                {/* LEFT SIDEBAR */}
                <div className="w-48 space-y-2 border-r pr-4">
                    <ScrollArea className="h-80">
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

                {/* RIGHT PANEL */}
                {selectedEnv && (
                    <div className="flex-1 space-y-4">
                        <FieldGroup>
                            <Field>
                                <Label>Environment Name</Label>
                                <Input
                                    value={selectedEnv.name}
                                    onChange={(e) =>
                                        updateEnvironment(selectedEnv.id, {
                                            name: e.target.value
                                        })
                                    }
                                />
                            </Field>
                        </FieldGroup>

                        <div className="space-y-3">
                            {selectedEnv.variables.map((v) => (
                                <FieldGroup key={v.id}>
                                    <div className="grid grid-cols-[1fr_1fr_auto_auto] gap-2 items-center">
                                        <Input
                                            placeholder="key"
                                            value={v.key}
                                            onChange={(e) =>
                                                updateEnvironmentVariable(
                                                    selectedEnv.id,
                                                    v.id,
                                                    { key: e.target.value }
                                                )
                                            }
                                        />

                                        <Input
                                            placeholder="value"
                                            value={v.value}
                                            onChange={(e) =>
                                                updateEnvironmentVariable(
                                                    selectedEnv.id,
                                                    v.id,
                                                    { value: e.target.value }
                                                )
                                            }
                                        />

                                        <Switch
                                            checked={v.enabled}
                                            onCheckedChange={(checked) =>
                                                updateEnvironmentVariable(
                                                    selectedEnv.id,
                                                    v.id,
                                                    { enabled: checked }
                                                )
                                            }
                                        />

                                        <Button
                                            variant="ghost"
                                            onClick={() =>
                                                deleteEnvironmentVariable(
                                                    selectedEnv.id,
                                                    v.id
                                                )
                                            }
                                        >
                                            <Trash2 />
                                        </Button>
                                    </div>
                                </FieldGroup>
                            ))}

                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    onClick={() =>
                                        addEnvironmentVariable(selectedEnv.id)
                                    }
                                >
                                    <Plus /> Add Variable
                                </Button>

                                <Button
                                    variant="destructive"
                                    onClick={() =>
                                        deleteEnvironment(selectedEnv.id)
                                    }
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
