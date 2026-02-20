import {useWorkspaceStore} from "../../store/workspaceStore";
import {RequestConfigRow} from "./RequestConfigRow";
import {Button, H1, P} from "./ui";
import {Panel, Group} from "react-resizable-panels";
import {RequestEditorPanel} from "./RequestEditorPanel";
import {ResponsePanel} from "./RequestPanel";
import {AuthTab} from "./AuthTab";
import {Plus} from "lucide-react";
import {RequestItem} from "./RequestItem";




function CollectionPanel({collection}) {
    const workspace = useWorkspaceStore(s => s.workspace);
    const selectRequest = useWorkspaceStore(s => s.selectRequest);
    const createRequest = useWorkspaceStore(s => s.createRequest);
    const setCollectionAuthType = useWorkspaceStore(s => s.setCollectionAuthType);
    const setCollectionAuthConfig = useWorkspaceStore(s => s.setCollectionAuthConfig)

    if (!workspace) return null;

    const requests = workspace.requests.filter(
        r => r.collectionId === collection.id
    );

    return (
        <div className="flex flex-col h-full min-h-0 overflow-hidden p-2 md:p-3 gap-4">
            <div className="shrink-0 flex justify-between items-center">
                <H1>{collection.name}</H1>
            </div>

            <div className="flex-1 min-h-0 overflow-hidden">
                <Group direction="horizontal" className="h-full">

                    <Panel defaultSize={60} minSize={25}>
                        <AuthTab
                            auth={collection.auth}
                            onChangeType={(type) =>
                                setCollectionAuthType(collection.id, type)
                            }
                            onChangeConfig={(config) =>
                                setCollectionAuthConfig(collection.id, config)
                            }
                        />
                    </Panel>

                    <Panel defaultSize={40} minSize={30}>
                        <div className="h-full flex flex-col">
                            <div className="flex items-center justify-between px-3 py-2 border-b border-border">
                                <span className="text-sm font-semibold">Requests</span>

                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => {
                                        const newRequestId = createRequest(collection.id, "New Request")
                                        selectRequest(newRequestId)
                                    }}
                                >
                                    <Plus />
                                </Button>
                            </div>

                            <div className="flex-1 overflow-y-auto px-2 py-2 space-y-1">
                                {requests.length === 0 ? (
                                    <P className="text-muted-foreground text-sm">
                                        No requests yet
                                    </P>
                                ) : (
                                    requests.map(request => (
                                        <RequestItem request={request} />
                                    ))
                                )}
                            </div>
                        </div>
                    </Panel>

                </Group>
            </div>
        </div>
    );
}

export function RequestArea() {
    const workspace = useWorkspaceStore((s) => s.workspace);
    const selectedRequestId = useWorkspaceStore((s) => s.selectedRequestId);
    const selectedCollectionId = useWorkspaceStore((s) => s.selectedCollectionId);
    const response = useWorkspaceStore(
        (s) => s.workspace?.responses?.[s.selectedRequestId]
    );

    if (!workspace) return null;

    const mode =
        selectedRequestId
            ? "request"
            : selectedCollectionId
                ? "collection"
                : "empty";

    if (mode === "request") {
        const request = workspace.requests.find(
            (r) => r.id === selectedRequestId
        );

        if (!request) {
            return (
                <div className="h-full flex items-center justify-center">
                    <P>Request not found</P>
                </div>
            );
        }

        return (
            <div className="flex flex-col h-full min-h-0 overflow-hidden p-2 md:p-3 gap-4">
                <div className="shrink-0">
                    <RequestConfigRow request={request}/>
                </div>

                <div className="flex-1 min-h-0 overflow-hidden">
                    <Group direction="horizontal" className="h-full">
                        <Panel defaultSize={50} minSize={30}>
                            <RequestEditorPanel request={request}/>
                        </Panel>

                        <Panel defaultSize={50} minSize={30}>
                            <ResponsePanel response={response}/>
                        </Panel>
                    </Group>
                </div>
            </div>
        );
    }

    if (mode === "collection") {
        const collection = workspace.collections.find(
            (c) => c.id === selectedCollectionId
        );

        if (!collection) {
            return (
                <div className="h-full flex items-center justify-center">
                    <P>Collection not found</P>
                </div>
            );
        }

        return <CollectionPanel collection={collection}/>;
    }

    return (
        <div className="h-full flex items-center justify-center">
            <P>Select a collection or request</P>
        </div>
    );
}