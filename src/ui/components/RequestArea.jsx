import {useWorkspaceStore} from "../../store/workspaceStore";
import {ResponseEditor} from "./ResponseEditor";
import {HeadersViewer} from "./HeadersViewer";
import {HeadersEditor} from "./HeadersEditor";
import {CodeEditor} from "./CodeEditor";
import {RequestConfigRow} from "./RequestConfigRow";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
    ScrollArea, Button, Select, SelectTrigger, SelectValue, SelectContent, SelectItem, H1,
} from "./ui";
import {Panel, Group} from "react-resizable-panels";

export function RequestArea() {
    const workspace = useWorkspaceStore((s) => s.workspace);
    const selectedRequestId = useWorkspaceStore((s) => s.selectedRequestId);
    const updateRequest = useWorkspaceStore((s) => s.updateRequest);
    const response = useWorkspaceStore((s) =>
        s.responses[s.selectedRequestId]
    );
    const setRequestBodyType = useWorkspaceStore((s) => s.setRequestBodyType);

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
        <div className="flex flex-col h-full min-h-0 overflow-hidden p-4 md:p-6 gap-4">

            {/* Header */}
            <div className="shrink-0">
                <RequestConfigRow request={request}/>
            </div>

            {/* Split Area */}
            <div className="flex-1 min-h-0 overflow-hidden">

                <Group direction="horizontal" className="h-full">

                    {/* LEFT PANEL */}
                    <Panel defaultSize={50} minSize={30}>
                        <div className="flex flex-col h-full min-h-0 overflow-hidden pr-3">

                            <Tabs
                                defaultValue="body"
                                className="flex flex-col flex-1 min-h-0"
                            >
                                <TabsList className="shrink-0 border-b text-sm">
                                    <TabsTrigger value="body">Body</TabsTrigger>
                                    <TabsTrigger value="headers">Headers</TabsTrigger>
                                    <TabsTrigger value="auth">Auth</TabsTrigger>
                                </TabsList>

                                <TabsContent
                                    value="body"
                                    className="flex-1 min-h-0 overflow-hidden flex flex-col gap-2"
                                >
                                    <Select
                                        value={request.body.type}
                                        onValueChange={(value) =>
                                            setRequestBodyType(request.id, value)
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue/>
                                        </SelectTrigger>

                                        <SelectContent>
                                            <SelectItem value="none">None</SelectItem>
                                            <SelectItem value="json">JSON</SelectItem>
                                            <SelectItem value="text">Text</SelectItem>
                                            <SelectItem value="form">Form Data</SelectItem>
                                            <SelectItem value="urlencoded">URL Encoded</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <CodeEditor
                                        value={request.body?.content || ""}
                                        onChange={(val) =>
                                            updateRequest(request.id, {
                                                body: {...request.body, content: val},
                                            })
                                        }
                                        language="json"
                                    />
                                </TabsContent>

                                <TabsContent
                                    value="headers"
                                    className="flex-1 min-h-0 overflow-hidden"
                                >
                                    <ScrollArea className="h-full">
                                        <HeadersEditor request={request}/>
                                    </ScrollArea>
                                </TabsContent>

                                <TabsContent
                                    value="auth"
                                    className="flex-1 min-h-0 overflow-hidden">
                                    <H1>Auth</H1>
                                </TabsContent>
                            </Tabs>
                        </div>
                    </Panel>

                    {/* RIGHT PANEL */}
                    <Panel defaultSize={50} minSize={30}>
                        <div className="flex flex-col h-full min-h-0 overflow-hidden pl-3 border-l border-border">

                            {response && !response.aborted && !response.error && (
                                <>
                                    <div className="flex items-center gap-4 shrink-0">
                  <span className="text-green-400 font-medium">
                    {response.status} {response.statusText}
                  </span>
                                        <span className="text-muted-foreground text-sm">
                    {response.duration} ms
                  </span>
                                    </div>

                                    <Tabs
                                        defaultValue="body"
                                        className="flex flex-col flex-1 min-h-0 mt-2"
                                    >
                                        <TabsList className="shrink-0 border-b text-sm">
                                            <TabsTrigger value="body">Body</TabsTrigger>
                                            <TabsTrigger value="headers">Headers</TabsTrigger>
                                        </TabsList>

                                        <TabsContent
                                            value="body"
                                            className="flex-1 min-h-0 overflow-hidden"
                                        >
                                            <ScrollArea className="h-full">
                                                <ResponseEditor
                                                    body={response.body}
                                                    headers={response.headers}
                                                />
                                            </ScrollArea>
                                        </TabsContent>

                                        <TabsContent
                                            value="headers"
                                            className="flex-1 min-h-0 overflow-hidden"
                                        >
                                            <ScrollArea className="h-full">
                                                <HeadersViewer headers={response.headers}/>
                                            </ScrollArea>
                                        </TabsContent>
                                    </Tabs>
                                </>
                            )}

                            {response?.aborted && (
                                <div className="text-yellow-400">
                                    ⚠ Request cancelled
                                </div>
                            )}

                            {response?.error && (
                                <div className="text-red-400">
                                    {response.error}
                                </div>
                            )}
                        </div>
                    </Panel>

                </Group>
            </div>
        </div>
    );

}
