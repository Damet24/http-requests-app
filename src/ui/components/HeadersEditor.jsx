import {useWorkspaceStore} from "../../store/workspaceStore";
import {Button, Input, Switch} from "./ui";
import {Trash2, Plus} from 'lucide-react'

export function HeadersEditor({request}) {
    const addHeader = useWorkspaceStore(s => s.addHeader);
    const updateHeader = useWorkspaceStore(s => s.updateHeader);
    const removeHeader = useWorkspaceStore(s => s.removeHeader);

    return (
        <div className="flex flex-col gap-2 w-full">

            <div className="grid grid-cols-12 gap-2 text-xs text-zinc-400 px-2">
                <div className="col-span-5">Key</div>
                <div className="col-span-5">Value</div>
                <div className="col-span-2"></div>
            </div>

            {request.headers.map(header => (
                <div
                    key={header.id}
                    className="grid grid-cols-[1fr_1fr_auto] gap-2 items-center"
                >
                    <Input
                        value={header.key}
                        onChange={(e) =>
                            updateHeader(request.id, header.id, {
                                key: e.target.value
                            })
                        }
                        placeholder="Header name"
                        className="min-w-0 w-full"
                    />

                    <Input
                        value={header.value}
                        onChange={(e) =>
                            updateHeader(request.id, header.id, {
                                value: e.target.value
                            })
                        }
                        className="min-w-0 w-full"
                        placeholder="Header value"
                    />

                    <div className="flex items-center gap-2">
                        <Switch
                            checked={header.enabled}
                            onCheckedChange={(checked) =>
                                updateHeader(request.id, header.id, {
                                    enabled: checked,
                                })
                            }
                        />
                        <Button
                            variant="ghost"
                            onClick={() =>
                                removeHeader(request.id, header.id)
                            }
                        >
                            <Trash2 />
                        </Button>
                    </div>
                </div>
            ))}


            <Button
                variant="outline"
                onClick={() => addHeader(request.id)}
            >
                <Plus/> Add Header
            </Button>
        </div>
    );
}
