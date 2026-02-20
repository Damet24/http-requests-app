import {Badge} from "./ui"

export function ResponseStatusBar({response}) {
    return (
        <div className="flex items-center gap-4 shrink-0">
            <Badge className="bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300">{response.status} {response.statusText}</Badge>
            <span className="text-muted-foreground text-sm">
                {response.duration} ms
            </span>
        </div>
    );
}