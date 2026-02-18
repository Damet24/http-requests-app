import {useWorkspaceStore} from "../../store/workspaceStore";
import {useState} from "react";
import {ResponseEditor} from "./ResponseEditor";
import {HeadersViewer} from "./HeadersViewer";
import {HeadersEditor} from "./HeadersEditor";
import {CodeEditor} from "./CodeEditor";
import {RequestConfigRow} from "./RequestConfigRow";

export function RequestArea() {
    const workspace = useWorkspaceStore(s => s.workspace);
    const selectedRequestId = useWorkspaceStore(s => s.selectedRequestId);
    const updateRequest = useWorkspaceStore(s => s.updateRequest);
    const response = useWorkspaceStore(s => s.response);


    const [responseTab, setResponseTab] = useState("body");
    const [requestTab, setRequestTab] = useState("body");


    if (!selectedRequestId) {
        return (
            <div className="flex-1 flex items-center justify-center text-zinc-500">
                Select a request
            </div>
        );
    }

    const request = workspace.requests.find(
        r => r.id === selectedRequestId
    );

    if (!request) return null;

    return (
        <div className="flex-1 flex flex-col min-h-0 p-4 md:p-6 gap-4">

            {/* Title */}
            <h2 className="text-lg font-semibold">{request.name}</h2>

            {/* Request Config Row */}
            <RequestConfigRow request={request}/>

            {/* Request Tabs */}
            <div className="flex gap-4 border-b border-zinc-700 text-sm">
                <button
                    onClick={() => setRequestTab("body")}
                    className={`pb-2 ${
                        requestTab === "body"
                            ? "text-blue-400 border-b-2 border-blue-400"
                            : "text-zinc-400 hover:text-zinc-200"
                    }`}
                >
                    Body
                </button>

                <button
                    onClick={() => setRequestTab("headers")}
                    className={`pb-2 ${
                        requestTab === "headers"
                            ? "text-blue-400 border-b-2 border-blue-400"
                            : "text-zinc-400 hover:text-zinc-200"
                    }`}
                >
                    Headers
                </button>
            </div>

            {/* Request Content */}
            <div className="flex-1 min-h-0 overflow-hidden">
                {requestTab === "body" && (
                    <CodeEditor
                        value={request.body?.content || ""}
                        onChange={(val) =>
                            updateRequest(request.id, {
                                body: {...request.body, content: val}
                            })
                        }
                        language="json"
                    />
                )}

                {requestTab === "headers" && (
                    <HeadersEditor request={request}/>
                )}
            </div>

            {/* Response Panel */}
            {response && (
                <div className="bg-zinc-800 rounded text-sm flex flex-col flex-1 min-h-0 p-3 overflow-hidden">

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

                            {/* Response Tabs */}
                            <div className="flex gap-4 border-b border-zinc-700 text-sm mt-2">
                                <button
                                    onClick={() => setResponseTab("body")}
                                    className={`pb-2 ${
                                        responseTab === "body"
                                            ? "text-blue-400 border-b-2 border-blue-400"
                                            : "text-zinc-400 hover:text-zinc-200"
                                    }`}
                                >
                                    Body
                                </button>

                                <button
                                    onClick={() => setResponseTab("headers")}
                                    className={`pb-2 ${
                                        responseTab === "headers"
                                            ? "text-blue-400 border-b-2 border-blue-400"
                                            : "text-zinc-400 hover:text-zinc-200"
                                    }`}
                                >
                                    Headers
                                </button>
                            </div>

                            {/* Response Content */}
                            <div className="flex-1 min-h-0 overflow-hidden mt-2">
                                {responseTab === "body" && (
                                    <ResponseEditor
                                        body={response.body}
                                        headers={response.headers}
                                    />
                                )}

                                {responseTab === "headers" && (
                                    <HeadersViewer headers={response.headers}/>
                                )}
                            </div>
                        </>
                    )}
                </div>
            )}


        </div>
    );
}
