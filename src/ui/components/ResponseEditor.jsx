import CodeMirror from "@uiw/react-codemirror";
import { json } from "@codemirror/lang-json";
import { EditorView } from "@codemirror/view";
import {AppThemeEditor} from "./EdetorTheme";

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
        <div className="flex-1 min-h-0 w-full rounded-lg border-zinc-800 border">
            <CodeMirror
                value={formattedBody || ""}
                theme={AppThemeEditor}
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
