import CodeMirror from "@uiw/react-codemirror";
import {EditorView, Decoration, ViewPlugin} from "@codemirror/view";
import {RangeSetBuilder} from "@codemirror/state";
import {barf} from 'thememirror';
import {autocompletion} from "@codemirror/autocomplete";


function createVariableCompletion(variables) {
    return (context) => {
        const word = context.matchBefore(/\{\{[\w]*$/);

        if (!word) return null;

        if (word.from === word.to && !context.explicit) {
            return null;
        }

        return {
            from: word.from + 2, // skip {{
            options: variables.map(v => ({
                label: v.key,
                type: "variable",
                apply: v.key + "}}"
            }))
        };
    };
}


// Highlight {{variable}}
const variablePlugin = ViewPlugin.fromClass(
    class {
        decorations;

        constructor(view) {
            this.decorations = this.buildDecorations(view);
        }

        update(update) {
            if (update.docChanged || update.viewportChanged) {
                this.decorations = this.buildDecorations(update.view);
            }
        }

        buildDecorations(view) {
            const builder = new RangeSetBuilder();
            const regex = /\{\{(.*?)\}\}/g;

            for (let {from, to} of view.visibleRanges) {
                const text = view.state.doc.sliceString(from, to);
                let match;
                while ((match = regex.exec(text))) {
                    const start = from + match.index;
                    const end = start + match[0].length;

                    builder.add(
                        start,
                        end,
                        Decoration.mark({
                            class: "text-purple-400 font-medium"
                        })
                    );
                }
            }

            return builder.finish();
        }
    },
    {
        decorations: v => v.decorations
    }
);

export function UrlEditor({value, onChange, variables = []}) {
    return (
        <div className="flex-1 border border-zinc-700 rounded bg-zinc-800 overflow-hidden">
            <CodeMirror
                value={value || ""}
                theme={barf}
                extensions={[
                    EditorView.lineWrapping,
                    variablePlugin,
                    autocompletion({
                        override: [createVariableCompletion(variables)]
                    }),
                    EditorView.theme({
                        "&": {fontSize: "14px"},
                        ".cm-content": {padding: "6px 8px"},
                        ".cm-scroller": {overflow: "hidden"}
                    })
                ]}

                basicSetup={{
                    lineNumbers: false,
                    foldGutter: false,
                    highlightActiveLine: false
                }}
                onChange={onChange}
            />
        </div>
    );
}
