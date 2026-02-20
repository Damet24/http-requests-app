import {
    Tabs,
    TabsList,
    TabsTrigger,
    TabsContent,
} from "./ui";
import {AuthTab} from "./AuthTab";
import {BodyTab} from "./BodyTab";
import {HeadersTab} from "./HeadersTab";
import {useWorkspaceStore} from "../../store/workspaceStore";

export function RequestEditorPanel({request}) {
    const setRequestAuthType = useWorkspaceStore(s => s.setRequestAuthType)
    const setRequestAuthConfig = useWorkspaceStore(s => s.setRequestAuthConfig)

    return (
        <div className="flex flex-col h-full min-h-0 overflow-hidden pr-3">
            <Tabs defaultValue="body" className="flex flex-col flex-1 min-h-0">
                <TabsList className="shrink-0 border-b text-sm w-full">
                    <TabsTrigger value="body">Body</TabsTrigger>
                    <TabsTrigger value="headers">Headers</TabsTrigger>
                    <TabsTrigger value="auth">Auth</TabsTrigger>
                </TabsList>

                <TabsContent value="body" className="flex-1 min-h-0 overflow-hidden flex flex-col gap-2">
                    <BodyTab request={request}/>
                </TabsContent>

                <TabsContent value="headers" className="flex-1 min-h-0 overflow-hidden">
                    <HeadersTab request={request}/>
                </TabsContent>

                <TabsContent value="auth" className="flex-1 min-h-0 overflow-hidden">
                    <AuthTab
                        inherit
                        auth={request.auth}
                        onChangeType={(type) =>
                            setRequestAuthType(request.id, type)
                        }
                        onChangeConfig={(config) =>
                            setRequestAuthConfig(request.id, config)
                        }
                    />
                </TabsContent>
            </Tabs>
        </div>
    );
}
