import { useWorkspaceStore } from "../../store/workspaceStore";
import { ResponseEditor } from "./ResponseEditor";
import { HeadersViewer } from "./HeadersViewer";
import { HeadersEditor } from "./HeadersEditor";
import { CodeEditor } from "./CodeEditor";
import { RequestConfigRow } from "./RequestConfigRow";
import {
    Button,
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "./ui";

export function RequestArea() {
    const workspace = useWorkspaceStore((s) => s.workspace);
    const selectedRequestId = useWorkspaceStore((s) => s.selectedRequestId);
    const updateRequest = useWorkspaceStore((s) => s.updateRequest);
    const response = useWorkspaceStore((s) => s.response);

    if (!selectedRequestId) {
        return (
            <div className="flex-1 flex items-center justify-center text-zinc-500">
                Select a request
            </div>
        );
    }

    const request = workspace.requests.find(
        (r) => r.id === selectedRequestId
    );

    if (!request) return null;

    return (
        <div className="flex-1 flex flex-col min-h-0 p-4 md:p-6 gap-4">

            {/* Title */}
            <h2 className="text-lg font-semibold">{request.name}</h2>

            {/* Request Config Row */}
            <RequestConfigRow request={request} />

            {/* REQUEST TABS */}
            <Tabs defaultValue="body" className="flex flex-col flex-1 min-h-0">

                <TabsList className="border-b text-sm">
                    <TabsTrigger value="body">Body</TabsTrigger>
                    <TabsTrigger value="headers">Headers</TabsTrigger>
                </TabsList>

                <div className="flex-1 min-h-0 overflow-hidden">
                    <TabsContent value="body" className="h-full">
                        <CodeEditor
                            value={request.body?.content || ""}
                            onChange={(val) =>
                                updateRequest(request.id, {
                                    body: { ...request.body, content: val },
                                })
                            }
                            language="json"
                        />
                    </TabsContent>

                    <TabsContent value="headers" className="h-full">
                        <HeadersEditor request={request} />
                    </TabsContent>
                </div>
            </Tabs>

            {/* RESPONSE PANEL */}
            {response && (
                <div className="rounded text-sm flex flex-col flex-1 min-h-0 p-3 overflow-hidden">

                    {response.aborted ? (
                        <div className="flex items-center gap-2 text-yellow-400">
                            ⚠ Request cancelled
                        </div>
                    ) : response.error ? (
                        <div className="text-red-400">{response.error}</div>
                    ) : (
                        <>
                            {/* Status Row */}
                            <div className="flex items-center gap-4">
                <span className="text-green-400 font-medium">
                  {response.status} {response.statusText}
                </span>

                                <span className="text-zinc-400">
                  {response.duration} ms
                </span>
                            </div>

                            {/* RESPONSE TABS */}
                            <Tabs
                                defaultValue="body"
                                className="flex flex-col flex-1 min-h-0 mt-2"
                            >
                                <TabsList className="border-b border-zinc-700 text-sm">
                                    <TabsTrigger value="body">Body</TabsTrigger>
                                    <TabsTrigger value="headers">Headers</TabsTrigger>
                                </TabsList>

                                <div className="flex-1 min-h-0 overflow-hidden mt-2">
                                    <TabsContent value="body" className="h-full">
                                        <ResponseEditor
                                            body={response.body}
                                            headers={response.headers}
                                        />
                                    </TabsContent>

                                    <TabsContent value="headers" className="h-full">
                                        <HeadersViewer headers={response.headers} />
                                    </TabsContent>
                                </div>
                            </Tabs>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}
