import {create} from "zustand";
import {subscribeWithSelector} from "zustand/middleware";
import debounce from "lodash.debounce";

const AUTOSAVE_DELAY = 300;

export const useWorkspaceStore = create(
    subscribeWithSelector((set, get) => ({
        workspace: null,
        isLoaded: false,
        selectedRequestId: null,
        isSending: false,


        loadWorkspace: async () => {
            const data = await window.api.workspace.load();

            set({
                workspace: {
                    ...data,
                    responses: data.responses || {}
                },
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
            const {workspace} = get();
            if (!workspace) return;

            set({
                workspace: {
                    ...workspace,
                    collections: workspace.collections.map(c =>
                        c.id === collectionId
                            ? {...c, ...updates}
                            : c
                    )
                }
            });
        },

        deleteCollection: (collectionId) => {
            const {workspace, selectedRequestId} = get();
            if (!workspace) return;

            const collection = workspace.collections.find(c => c.id === collectionId);
            if (!collection) return;

            const requestIdsToDelete = collection.requestIds;

            const updatedRequests = workspace.requests.filter(
                r => !requestIdsToDelete.includes(r.id)
            );

            const updatedCollections = workspace.collections.filter(
                c => c.id !== collectionId
            );

            set({
                workspace: {
                    ...workspace,
                    collections: updatedCollections,
                    requests: updatedRequests,
                },
                selectedRequestId: requestIdsToDelete.includes(selectedRequestId)
                    ? null
                    : selectedRequestId,
            });
        },

        duplicateCollection: (collectionId) => {
            const {workspace} = get();
            if (!workspace) return;

            const original = workspace.collections.find(c => c.id === collectionId);
            if (!original) return;

            const newCollectionId = crypto.randomUUID();

            const originalRequests = workspace.requests.filter(
                r => r.collectionId === collectionId
            );

            const duplicatedRequests = originalRequests.map(req => {
                const newRequestId = crypto.randomUUID();

                return {
                    ...req,
                    id: newRequestId,
                    collectionId: newCollectionId,
                    name: req.name + " Copy",
                };
            });

            const newCollection = {
                ...original,
                id: newCollectionId,
                name: original.name + " Copy",
                requestIds: duplicatedRequests.map(r => r.id),
            };

            set({
                workspace: {
                    ...workspace,
                    collections: [...workspace.collections, newCollection],
                    requests: [...workspace.requests, ...duplicatedRequests],
                },
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
                body: {type: "json", content: ""}
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

        setRequestBodyType: (requestId, type) => {
            const { workspace } = get();
            if (!workspace) return;

            const contentTypeMap = {
                json: "application/json",
                text: "text/plain",
                form: "multipart/form-data",
                urlencoded: "application/x-www-form-urlencoded",
            };

            const updatedRequests = workspace.requests.map(req => {
                if (req.id !== requestId) return req;

                let updatedHeaders = [...req.headers];

                // Remove existing content-type
                updatedHeaders = updatedHeaders.filter(
                    h => h.key.toLowerCase() !== "content-type"
                );

                // Add new content-type if needed
                if (contentTypeMap[type]) {
                    updatedHeaders.push({
                        id: crypto.randomUUID(),
                        key: "Content-Type",
                        value: contentTypeMap[type],
                        enabled: true
                    });
                }

                return {
                    ...req,
                    headers: updatedHeaders,
                    body: {
                        type,
                        content: ""
                    }
                };
            });

            set({
                workspace: {
                    ...workspace,
                    requests: updatedRequests
                }
            });
        },

        setRequestAuthType: (requestId, type) => {
            const { workspace } = get();
            if (!workspace) return;

            const defaultConfigs = {
                none: {},
                basic: { username: "", password: "" },
                bearer: { token: "" },
                api: { key: "", value: "", in: "header" } // header | query
            };

            const updatedRequests = workspace.requests.map(req => {
                if (req.id !== requestId) return req;

                return {
                    ...req,
                    auth: {
                        type,
                        config: defaultConfigs[type] || {}
                    }
                };
            });

            set({
                workspace: {
                    ...workspace,
                    requests: updatedRequests
                }
            });
        },

        setRequestAuthConfig: (requestId, config) => {
            const { workspace } = get();
            if (!workspace) return;

            const updatedRequests = workspace.requests.map(req => {
                if (req.id !== requestId) return req;

                return {
                    ...req,
                    auth: {
                        ...req.auth,
                        config: {
                            ...req.auth?.config,
                            ...config
                        }
                    }
                };
            });

            set({
                workspace: {
                    ...workspace,
                    requests: updatedRequests
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

        deleteRequest: (requestId) => {
            const {workspace, selectedRequestId} = get();
            if (!workspace) return;

            const updatedRequests = workspace.requests.filter(
                (r) => r.id !== requestId
            );

            const updatedCollections = workspace.collections.map((collection) => ({
                ...collection,
                requestIds: collection.requestIds.filter(
                    (id) => id !== requestId
                ),
            }));

            set({
                workspace: {
                    ...workspace,
                    requests: updatedRequests,
                    collections: updatedCollections,
                },
                selectedRequestId:
                    selectedRequestId === requestId
                        ? null
                        : selectedRequestId,
            });
        },

        duplicateRequest: (requestId) => {
            const {workspace} = get();
            if (!workspace) return;

            const original = workspace.requests.find(r => r.id === requestId);
            if (!original) return;

            const newId = crypto.randomUUID();

            const duplicated = {
                ...original,
                id: newId,
                name: original.name + " Copy",
            };

            const updatedCollections = workspace.collections.map(c =>
                c.id === original.collectionId
                    ? {...c, requestIds: [...c.requestIds, newId]}
                    : c
            );

            set({
                workspace: {
                    ...workspace,
                    requests: [...workspace.requests, duplicated],
                    collections: updatedCollections,
                },
                selectedRequestId: newId,
            });
        },

        sendRequest: async () => {
            const { selectedRequestId, workspace } = get();
            if (!selectedRequestId || !workspace) return;

            set({ isSending: true });

            try {
                const res = await window.api.http.send(selectedRequestId);

                const updatedWorkspace = {
                    ...workspace,
                    responses: {
                        ...workspace.responses,
                        [selectedRequestId]: res?.aborted
                            ? { aborted: true }
                            : res
                    }
                };

                set({
                    workspace: updatedWorkspace,
                    isSending: false
                });

            } catch (err) {

                const updatedWorkspace = {
                    ...workspace,
                    responses: {
                        ...workspace.responses,
                        [selectedRequestId]: { error: err.message }
                    }
                };

                set({
                    workspace: updatedWorkspace,
                    isSending: false
                });
            }
        },

        addHeader: (requestId) => {
            const {workspace} = get();
            if (!workspace) return;

            const newHeader = {
                id: crypto.randomUUID(),
                key: "",
                value: "",
                enabled: true
            };

            const updatedRequests = workspace.requests.map(req =>
                req.id === requestId
                    ? {...req, headers: [...req.headers, newHeader]}
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
            const {workspace} = get();
            if (!workspace) return;

            const updatedRequests = workspace.requests.map(req =>
                req.id === requestId
                    ? {
                        ...req,
                        headers: req.headers.map(h =>
                            h.id === headerId
                                ? {...h, ...updates}
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
            const {workspace} = get();
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
            const { selectedRequestId, workspace } = get();
            if (!selectedRequestId || !workspace) return;

            await window.api.http.cancel(selectedRequestId);

            set({
                isSending: false,
                workspace: {
                    ...workspace,
                    responses: {
                        ...workspace.responses,
                        [selectedRequestId]: { aborted: true }
                    }
                }
            });
        },

        createEnvironment: (name) => {
            const {workspace} = get();
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
            const {workspace} = get();
            if (!workspace) return;

            set({
                workspace: {
                    ...workspace,
                    environments: workspace.environments.map(env =>
                        env.id === envId ? {...env, ...updates} : env
                    )
                }
            });
        },

        deleteEnvironment: (envId) => {
            const {workspace} = get();
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

