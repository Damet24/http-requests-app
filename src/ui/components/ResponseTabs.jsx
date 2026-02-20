import {ScrollArea, Tabs, TabsContent, TabsList, TabsTrigger} from "./ui";
import {ResponseEditor} from "./ResponseEditor";
import {HeadersViewer} from "./HeadersViewer";

export function ResponseTabs({response}) {
    return (
        <Tabs
            defaultValue="body"
            className="flex flex-col flex-1 min-h-0 mt-2"
        >
            <TabsList className="shrink-0 border-b text-sm w-full">
                <TabsTrigger value="body">Body</TabsTrigger>
                <TabsTrigger value="headers">Headers</TabsTrigger>
            </TabsList>

            <TabsContent
                value="body"
                className="flex-1 min-h-0 overflow-hidden"
            >
                <ScrollArea className="h-full">
                    <ResponseEditor
                        body={response.body}
                        headers={response.headers}
                    />
                </ScrollArea>
            </TabsContent>

            <TabsContent
                value="headers"
                className="flex-1 min-h-0 overflow-hidden"
            >
                <ScrollArea className="h-full">
                    <HeadersViewer headers={response.headers}/>
                </ScrollArea>
            </TabsContent>
        </Tabs>
    );
}