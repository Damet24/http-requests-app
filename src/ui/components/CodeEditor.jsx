import CodeMirror from "@uiw/react-codemirror";
import {json} from "@codemirror/lang-json";
import {EditorView} from "@codemirror/view";
import {AppThemeEditor} from "./EdetorTheme";

export function CodeEditor({value, onChange, language = "json", readOnly = false}) {
    const extensions = [];

    if (language === "json") {
        extensions.push(json());
    }

    extensions.push(EditorView.lineWrapping);

    return (
        <div className="h-full w-full border border-zinc-800 rounded-lg overflow-hidden">
            <CodeMirror
                value={value || ""}
                theme={AppThemeEditor}
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
