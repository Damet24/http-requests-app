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
    ScrollArea, Button, Select, SelectTrigger, SelectValue, SelectContent, SelectItem, H1, Input, Field, FieldLabel,
    InputGroupInput, InputGroupAddon, InputGroup,
} from "./ui";
import {Panel, Group} from "react-resizable-panels";
import {EyeOffIcon, Eye} from "lucide-react";
import {useState} from "react";


function BasicAuthForm({request}) {
    const setRequestAuthConfig = useWorkspaceStore(
        s => s.setRequestAuthConfig
    );
    const [showPassword, setShowPassword] = useState(false);

    const config = request.auth?.config || {};

    return (
        <div className="flex flex-col gap-3 mt-4 px-2">
            <Field>
                <FieldLabel htmlFor="username">Username</FieldLabel>
                <InputGroup>
                    <InputGroupInput
                        id="username"
                        type="text"
                        placeholder="Username"
                        value={config.username || ""}
                        onChange={(e) =>
                            setRequestAuthConfig(request.id, {
                                username: e.target.value
                            })
                        }
                    />
                </InputGroup>
            </Field>

            <Field>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <InputGroup>
                    <InputGroupInput
                        id="password"
                        type="password"
                        placeholder="Password"
                        value={config.password || ""}
                        onChange={(e) =>
                            setRequestAuthConfig(request.id, {
                                password: e.target.value
                            })
                        }
                    />
                    <InputGroupAddon className="cursor-pointer" align="inline-end"
                                     onClick={() => setShowPassword(value => !value)}>
                        {showPassword ? <Eye/> : <EyeOffIcon/>}
                    </InputGroupAddon>
                </InputGroup>
            </Field>
        </div>
    );
}


function BearerAuthForm({request}) {
    const setRequestAuthConfig = useWorkspaceStore(
        s => s.setRequestAuthConfig
    );

    const config = request.auth?.config || {};

    return (
        <div className="flex flex-col gap-3 mt-4">
            <Field>
                <FieldLabel htmlFor="token">Token</FieldLabel>
                <InputGroup>
                    <InputGroupInput
                        id="token"
                        type="text"
                        placeholder="Token"
                        value={config.token || ""}
                        onChange={(e) =>
                            setRequestAuthConfig(request.id, {
                                token: e.target.value
                            })
                        }
                    />
                </InputGroup>
            </Field>
        </div>
    );
}


function APIKeyAuthForm({request}) {
    const setRequestAuthConfig = useWorkspaceStore(
        s => s.setRequestAuthConfig
    );

    const config = request.auth?.config || {};

    return (
        <div className="flex flex-col gap-3 mt-4">
            <Field>
                <FieldLabel htmlFor="token">Key name</FieldLabel>
                <InputGroup>
                    <InputGroupInput
                        type="text"
                        placeholder="Key name"
                        value={config.key || ""}
                        onChange={(e) =>
                            setRequestAuthConfig(request.id, {
                                key: e.target.value
                            })
                        }
                    />
                </InputGroup>
            </Field>

            <Field>
                <FieldLabel htmlFor="value">Key name</FieldLabel>
                <InputGroup>
                    <InputGroupInput
                        id="value"
                        type="text"
                        placeholder="Value"
                        value={config.value || ""}
                        onChange={(e) =>
                            setRequestAuthConfig(request.id, {
                                value: e.target.value
                            })
                        }
                    />
                </InputGroup>
            </Field>

            <Select
                value={config.in || "header"}
                onValueChange={(value) =>
                    setRequestAuthConfig(request.id, {
                        in: value
                    })
                }
            >
                <SelectTrigger>
                    <SelectValue/>
                </SelectTrigger>

                <SelectContent>
                    <SelectItem value="header">Header</SelectItem>
                    <SelectItem value="query">Query Param</SelectItem>
                </SelectContent>
            </Select>
        </div>
    );
}


export function RequestArea() {
    const workspace = useWorkspaceStore((s) => s.workspace);
    const selectedRequestId = useWorkspaceStore((s) => s.selectedRequestId);
    const updateRequest = useWorkspaceStore((s) => s.updateRequest);
    const response = useWorkspaceStore(
        (s) => s.workspace?.responses?.[s.selectedRequestId]
    );
    const setRequestBodyType = useWorkspaceStore((s) => s.setRequestBodyType);
    const setRequestAuthType = useWorkspaceStore((s) => s.setRequestAuthType);

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
        <div className="flex flex-col h-full min-h-0 overflow-hidden p-2 md:p-3 gap-4">

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
                                    <Select
                                        value={request.auth?.type || "none"}
                                        onValueChange={(value) =>
                                            setRequestAuthType(request.id, value)
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue/>
                                        </SelectTrigger>

                                        <SelectContent>
                                            <SelectItem value="none">None</SelectItem>
                                            <SelectItem value="basic">Basic auth</SelectItem>
                                            <SelectItem value="bearer">Bearer token</SelectItem>
                                            <SelectItem value="api">API key</SelectItem>
                                        </SelectContent>
                                    </Select>

                                    <div className="py-2">
                                        {request.auth?.type === "basic" && (
                                            <BasicAuthForm request={request}/>
                                        )}

                                        {request.auth?.type === "bearer" && (
                                            <BearerAuthForm request={request}/>
                                        )}

                                        {request.auth?.type === "api" && (
                                            <APIKeyAuthForm request={request}/>
                                        )}
                                    </div>

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
