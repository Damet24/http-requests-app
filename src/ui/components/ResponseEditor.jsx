import CodeMirror from "@uiw/react-codemirror";
import { json } from "@codemirror/lang-json";
import { oneDark } from "@codemirror/theme-one-dark";
import { EditorView } from "@codemirror/view";

export function ResponseEditor({ body, headers }) {
    const isJson =
        headers?.["content-type"]?.includes("application/json");

    let formattedBody = body;

    if (isJson) {
        try {
            const parsed = JSON.parse(body);
            formattedBody = JSON.stringify(parsed, null, 2);
        } catch {
            formattedBody = body;
        }
    }

    return (
        <div className="flex-1 min-h-0 w-full border border-zinc-800 rounded">
            <CodeMirror
                value={formattedBody || ""}
                theme={oneDark}
                extensions={[
                    ...(isJson ? [json()] : []),
                    EditorView.lineWrapping
                ]}
                editable={false}
                basicSetup={{
                    lineNumbers: true,
                    foldGutter: true,
                    highlightActiveLine: false
                }}
                className="h-full [&_.cm-editor]:h-full [&_.cm-scroller]:overflow-auto"
            />
        </div>
    );

}
