import { createTheme } from "thememirror";
import { tags as t } from "@lezer/highlight";

export const AppThemeEditor = createTheme({
    variant: "dark",

    settings: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        caret: "var(--primary)",
        selection: "color-mix(in srgb, var(--primary) 25%, transparent)",
        lineHighlight: "var(--card)",
        gutterBackground: "var(--background)",
        gutterForeground: "var(--muted-foreground)",
    },

    styles: [
        // Comments
        {
            tag: t.comment,
            color: "var(--muted-foreground)",
            fontStyle: "italic",
        },

        // 🔑 JSON keys
        {
            tag: t.propertyName,
            color: "var(--chart-4)",
            fontWeight: "500",
        },

        // Strings
        {
            tag: t.string,
            color: "var(--chart-2)",
        },

        // Numbers
        {
            tag: t.number,
            color: "var(--chart-3)",
        },

        // Boolean / null
        {
            tag: [t.bool, t.null],
            color: "var(--chart-5)",
            fontWeight: "500",
        },

        // Keywords
        {
            tag: t.keyword,
            color: "var(--primary)",
            fontWeight: "500",
        },

        // Operators
        {
            tag: t.operator,
            color: "var(--foreground)",
        },

        // Brackets
        {
            tag: [t.brace, t.squareBracket],
            color: "var(--muted-foreground)",
        },

        // Types
        {
            tag: [t.typeName, t.definition(t.typeName)],
            color: "var(--chart-5)",
        },

        // HTML-ish
        {
            tag: t.tagName,
            color: "var(--destructive)",
        },

        {
            tag: t.attributeName,
            color: "var(--chart-2)",
        },
    ],
});
