import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "./ui";
import {CodeEditor} from "./CodeEditor";
import {useWorkspaceStore} from "../../store/workspaceStore";

export function BodyTab({request}) {
    const setRequestBodyType = useWorkspaceStore((s) => s.setRequestBodyType);
    const updateRequest = useWorkspaceStore((s) => s.updateRequest);

    return (
        <>
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
        </>
    );
}