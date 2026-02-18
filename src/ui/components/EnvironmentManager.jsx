import { useWorkspaceStore } from "../../store/workspaceStore";
import { useState } from "react";
import { Button } from "./ui/button";

export function EnvironmentManager({ onClose }) {
    const workspace = useWorkspaceStore(s => s.workspace);
    const createEnvironment = useWorkspaceStore(s => s.createEnvironment);
    const updateEnvironment = useWorkspaceStore(s => s.updateEnvironment);
    const deleteEnvironment = useWorkspaceStore(s => s.deleteEnvironment);

    const [selectedEnvId, setSelectedEnvId] = useState(
        workspace.activeEnvironmentId
    );

    const selectedEnv = workspace.environments.find(
        e => e.id === selectedEnvId
    );

    return (
        <div className="space-y-4">

            <h2 className="text-lg font-semibold">
                Manage Environments
            </h2>

            {/* Environment List */}
            <div className="flex gap-4">
                <div className="w-48 space-y-2">
                    {workspace.environments.map(env => (
                        <div
                            key={env.id}
                            onClick={() => setSelectedEnvId(env.id)}
                            className={`cursor-pointer px-2 py-1 rounded ${
                                env.id === selectedEnvId
                                    ? "bg-zinc-800"
                                    : "hover:bg-zinc-800 text-zinc-400"
                            }`}
                        >
                            {env.name}
                        </div>
                    ))}

                    <Button
                        size="sm"
                        variant="secondary"
                        onClick={() =>
                            createEnvironment("New Environment")
                        }
                    >
                        + New
                    </Button>
                </div>

                {/* Variables */}
                {selectedEnv && (
                    <div className="flex-1 space-y-2">

                        <input
                            value={selectedEnv.name}
                            onChange={(e) =>
                                updateEnvironment(selectedEnv.id, {
                                    name: e.target.value
                                })
                            }
                            className="w-full bg-zinc-800 border border-zinc-700 rounded px-2 py-1"
                        />

                        {selectedEnv.variables.map((v, index) => (
                            <div key={index} className="flex gap-2">
                                <input
                                    value={v.key}
                                    onChange={(e) => {
                                        const updated = [...selectedEnv.variables];
                                        updated[index].key = e.target.value;
                                        updateEnvironment(selectedEnv.id, {
                                            variables: updated
                                        });
                                    }}
                                    placeholder="key"
                                    className="flex-1 bg-zinc-800 border border-zinc-700 rounded px-2 py-1"
                                />

                                <input
                                    value={v.value}
                                    onChange={(e) => {
                                        const updated = [...selectedEnv.variables];
                                        updated[index].value = e.target.value;
                                        updateEnvironment(selectedEnv.id, {
                                            variables: updated
                                        });
                                    }}
                                    placeholder="value"
                                    className="flex-1 bg-zinc-800 border border-zinc-700 rounded px-2 py-1"
                                />
                            </div>
                        ))}

                        <Button
                            size="sm"
                            variant="ghost"
                            onClick={() =>
                                updateEnvironment(selectedEnv.id, {
                                    variables: [
                                        ...selectedEnv.variables,
                                        { key: "", value: "" }
                                    ]
                                })
                            }
                        >
                            + Add Variable
                        </Button>

                        <Button
                            size="sm"
                            variant="danger"
                            onClick={() =>
                                deleteEnvironment(selectedEnv.id)
                            }
                        >
                            Delete Environment
                        </Button>

                    </div>
                )}
            </div>

            <div className="flex justify-end">
                <Button variant="primary" onClick={onClose}>
                    Done
                </Button>
            </div>

        </div>
    );
}
