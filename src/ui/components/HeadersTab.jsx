import {
    ScrollArea
} from "./ui";
import {HeadersEditor} from "./HeadersEditor";



export function HeadersTab({request}) {
    return <ScrollArea className="h-full">
        <HeadersEditor request={request}/>
    </ScrollArea>
}