import {contextBridge, ipcRenderer} from "electron";

contextBridge.exposeInMainWorld("api", {
    workspace: {
        load: () => ipcRenderer.invoke("workspace:load"),
        save: (workspace) => ipcRenderer.invoke("workspace:save", workspace)
    },

    collection: {
        create: (name) => ipcRenderer.invoke("collection:create", name)
    },

    environment: {
        create: (name) => ipcRenderer.invoke("environment:create", name),
        setActive: (envId) => ipcRenderer.invoke("environment:setActive", envId)
    },

    request: {
        create: (collectionId, name) =>
            ipcRenderer.invoke("request:create", {collectionId, name})
    },

    http: {
        send: (requestId) =>
            ipcRenderer.invoke("http:send", requestId),
        cancel: (requestId) =>
            ipcRenderer.invoke("http:cancel", requestId)
    }

});
