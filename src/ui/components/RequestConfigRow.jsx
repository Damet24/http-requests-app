import {useWorkspaceStore} from "../../store/workspaceStore";
import {MethodSelect} from "./MethodSelect";
import { Button } from "./ui/button";
import {UrlEditor} from "./UrlEditor";

export function RequestConfigRow({request}) {

    const sendRequest = useWorkspaceStore(s => s.sendRequest);
    const isSending = useWorkspaceStore(s => s.isSending);
    const cancelRequest = useWorkspaceStore(s => s.cancelRequest);
    const updateRequest = useWorkspaceStore(s => s.updateRequest);

    const workspace = useWorkspaceStore(s => s.workspace);

    const activeEnv = workspace.environments.find(
        env => env.id === workspace.activeEnvironmentId
    );

    const variables = activeEnv?.variables || [];



    return (<div className="flex flex-col md:flex-row gap-2">
        <MethodSelect
            value={request.method}
            onChange={(method) =>
                updateRequest(request.id, {method})
            }
        />


        <UrlEditor
            value={request.url}
            onChange={(val) =>
                updateRequest(request.id, { url: val })
            }
            variables={variables}
        />


        {isSending ? (
            <Button
                variant="danger"
                onClick={cancelRequest}
            >
                Cancel
            </Button>

        ) : (
            <Button
                variant="primary"
                onClick={sendRequest}
                loading={isSending}
            >
                Send
            </Button>

        )}

    </div>)
}