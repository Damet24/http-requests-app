import CodeMirror from "@uiw/react-codemirror";
import {json} from "@codemirror/lang-json";
import {oneDark} from "@codemirror/theme-one-dark";
import {EditorView} from "@codemirror/view";

export function CodeEditor({value, onChange, language = "json", readOnly = false}) {
    const extensions = [];

    if (language === "json") {
        extensions.push(json());
    }

    extensions.push(EditorView.lineWrapping);

    return (
        <div className="h-full w-full border border-zinc-800 rounded overflow-hidden">
            <CodeMirror
                value={value || ""}
                theme={oneDark}
                extensions={extensions}
                editable={!readOnly}
                onChange={onChange}
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
