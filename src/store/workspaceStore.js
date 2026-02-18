import {create} from "zustand";
import {subscribeWithSelector} from "zustand/middleware";
import debounce from "lodash.debounce";

const AUTOSAVE_DELAY = 300;

export const useWorkspaceStore = create(
    subscribeWithSelector((set, get) => ({
        workspace: null,
        isLoaded: false,
        selectedRequestId: null,
        response: null,
        isSending: false,

        loadWorkspace: async () => {
            const data = await window.api.workspace.load();

            set({
                workspace: data,
                isLoaded: true
            });
        },

        selectRequest: (requestId) => {
            set({selectedRequestId: requestId});
        },

        createCollection: (name) => {
            const {workspace} = get();
            if (!workspace) return;

            const collection = {
                id: crypto.randomUUID(),
                name,
                requestIds: []
            };

            set({
                workspace: {
                    ...workspace,
                    collections: [...workspace.collections, collection]
                }
            });
        },

        updateCollection: (collectionId, updates) => {
            const { workspace } = get();
            if (!workspace) return;

            set({
                workspace: {
                    ...workspace,
                    collections: workspace.collections.map(c =>
                        c.id === collectionId
                            ? { ...c, ...updates }
                            : c
                    )
                }
            });
        },

        setActiveEnvironment: (envId) => {
            const {workspace} = get();
            if (!workspace) return;

            set({
                workspace: {
                    ...workspace,
                    activeEnvironmentId: envId
                }
            });
        },

        createRequest: (collectionId, name) => {
            const {workspace} = get();
            if (!workspace) return;

            const request = {
                id: crypto.randomUUID(),
                name,
                collectionId,
                method: "GET",
                url: "",
                headers: [],
                body: {type: "none", content: ""}
            };

            const updatedCollections = workspace.collections.map(c =>
                c.id === collectionId
                    ? {...c, requestIds: [...c.requestIds, request.id]}
                    : c
            );

            set({
                workspace: {
                    ...workspace,
                    collections: updatedCollections,
                    requests: [...workspace.requests, request]
                }
            });
        },

        updateRequest: (requestId, updates) => {
            const {workspace} = get();
            if (!workspace) return;

            const updatedRequests = workspace.requests.map(request =>
                request.id === requestId
                    ? {...request, ...updates}
                    : request
            );

            set({
                workspace: {
                    ...workspace,
                    requests: updatedRequests
                }
            })
        },

        sendRequest: async () => {
            const { selectedRequestId } = get();
            if (!selectedRequestId) return;

            set({ isSending: true });

            try {
                const res = await window.api.http.send(selectedRequestId);

                if (res?.aborted) {
                    set({
                        isSending: false,
                        response: { aborted: true }
                    });
                    return;
                }

                set({
                    response: res,
                    isSending: false
                });
            } catch (err) {
                set({
                    response: { error: err.message },
                    isSending: false
                });
            }
        },

        addHeader: (requestId) => {
            const { workspace } = get();
            if (!workspace) return;

            const newHeader = {
                id: crypto.randomUUID(),
                key: "",
                value: "",
                enabled: true
            };

            const updatedRequests = workspace.requests.map(req =>
                req.id === requestId
                    ? { ...req, headers: [...req.headers, newHeader] }
                    : req
            );

            set({
                workspace: {
                    ...workspace,
                    requests: updatedRequests
                }
            });
        },

        updateHeader: (requestId, headerId, updates) => {
            const { workspace } = get();
            if (!workspace) return;

            const updatedRequests = workspace.requests.map(req =>
                req.id === requestId
                    ? {
                        ...req,
                        headers: req.headers.map(h =>
                            h.id === headerId
                                ? { ...h, ...updates }
                                : h
                        )
                    }
                    : req
            );

            set({
                workspace: {
                    ...workspace,
                    requests: updatedRequests
                }
            });
        },

        removeHeader: (requestId, headerId) => {
            const { workspace } = get();
            if (!workspace) return;

            const updatedRequests = workspace.requests.map(req =>
                req.id === requestId
                    ? {
                        ...req,
                        headers: req.headers.filter(h => h.id !== headerId)
                    }
                    : req
            );

            set({
                workspace: {
                    ...workspace,
                    requests: updatedRequests
                }
            });
        },

        cancelRequest: async () => {
            const { selectedRequestId } = get();
            if (!selectedRequestId) return;

            await window.api.http.cancel(selectedRequestId);

            set({
                isSending: false,
                response: { aborted: true }
            });
        },

        createEnvironment: (name) => {
            const { workspace } = get();
            if (!workspace) return;

            const newEnv = {
                id: crypto.randomUUID(),
                name,
                variables: []
            };

            set({
                workspace: {
                    ...workspace,
                    environments: [...workspace.environments, newEnv]
                }
            });
        },

        updateEnvironment: (envId, updates) => {
            const { workspace } = get();
            if (!workspace) return;

            set({
                workspace: {
                    ...workspace,
                    environments: workspace.environments.map(env =>
                        env.id === envId ? { ...env, ...updates } : env
                    )
                }
            });
        },

        deleteEnvironment: (envId) => {
            const { workspace } = get();
            if (!workspace) return;

            set({
                workspace: {
                    ...workspace,
                    environments: workspace.environments.filter(
                        env => env.id !== envId
                    ),
                    activeEnvironmentId:
                        workspace.activeEnvironmentId === envId
                            ? null
                            : workspace.activeEnvironmentId
                }
            });
        }

    }))
);

export const debouncedSave = debounce(async (workspace) => {
    await window.api.workspace.save(workspace);
}, AUTOSAVE_DELAY);

useWorkspaceStore.subscribe(
    state => state.workspace,
    (workspace, previousWorkspace) => {
        const isLoaded = useWorkspaceStore.getState().isLoaded;

        if (!isLoaded) return;
        if (!workspace) return;

        debouncedSave(workspace);
    }
);

