import CodeMirror from "@uiw/react-codemirror";
import {EditorView, Decoration, ViewPlugin} from "@codemirror/view";
import {RangeSetBuilder} from "@codemirror/state";
import {autocompletion} from "@codemirror/autocomplete";
import {cn} from "../../lib/utils";
import {AppThemeEditor} from "./EdetorTheme";


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
            const regex = /\{\{(.*?)}}/g;

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

export function UrlEditor({ value, onChange, variables = [] }) {
    return (
        <div
            data-slot="input"
            className={cn(
                "dark:bg-input/30 border-input focus-within:border-ring focus-within:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:aria-invalid:border-destructive/50 disabled:bg-input/50 dark:disabled:bg-input/80 h-8 rounded-lg border bg-transparent text-base transition-colors focus-within:ring-3 md:text-sm w-full min-w-0 outline-none overflow-hidden"
            )}
        >
            <CodeMirror
                value={value || ""}
                theme={AppThemeEditor}
                extensions={[
                    EditorView.lineWrapping,
                    variablePlugin,
                    autocompletion({
                        override: [createVariableCompletion(variables)],
                    }),
                ]}
                basicSetup={{
                    lineNumbers: false,
                    foldGutter: false,
                    highlightActiveLine: false,
                }}
                onChange={onChange}
            />
        </div>
    );
}

