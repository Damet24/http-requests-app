import {ResponseTabs} from "./ResponseTabs";
import {ResponseStatusBar} from "./ResponseStatusBar";


export function ResponsePanel({response}) {
    if (!response) return null;

    if (response.aborted)
        return <div className="text-yellow-400">⚠ Request cancelled</div>;

    if (response.error)
        return <div className="text-red-400">{response.error}</div>;

    return (
        <div className="flex flex-col h-full min-h-0 overflow-hidden pl-3 border-l border-border">
            <ResponseStatusBar response={response}/>
            <ResponseTabs response={response}/>
        </div>
    );
}

