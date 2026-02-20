import {ipcMain} from "electron";
import {loadWorkspace, saveWorkspace} from "../persistence/fileStorage.js";
import {createWorkspace} from "../../domain/models/workspace.js";
import {createCollection} from "../../domain/models/collection.js";
import {createEnvironment} from "../../domain/models/environment.js";
import {createRequest} from "../../domain/models/request.js";

let workspace = null;
const activeRequests = new Map();

function ensureWorkspace() {
    if (!workspace) {
        workspace = loadWorkspace();
    }

    if (!workspace) {
        workspace = createWorkspace("Main Workspace");
        saveWorkspace(workspace);
    }
}

function resolveVariables(input, variables) {
    if (!input) return input;

    return input.replace(/{{(.*?)}}/g, (_, key) => {
        const found = variables.find(
            v => v.key === key.trim()
        );
        return found ? found.value : "";
    });
}

function resolveAuthVariables(auth, variables) {
    if (!auth?.config) return auth;

    const resolvedConfig = {};

    for (const key in auth.config) {
        resolvedConfig[key] = resolveVariables(
            auth.config[key],
            variables
        );
    }

    return {
        ...auth,
        config: resolvedConfig
    };
}

function resolveRequestAuth(workspace, request) {
    if (!request.auth || request.auth.type !== "inherit") {
        return request.auth || { type: "none", config: {} };
    }

    const collection = workspace.collections.find(
        c => c.id === request.collectionId
    );

    return collection?.auth || { type: "none", config: {} };
}

export function registerIpcHandlers() {
    ipcMain.handle("workspace:load", () => {
        ensureWorkspace();
        return workspace;
    });

    ipcMain.handle("workspace:save", (_, newWorkspace) => {
        workspace = newWorkspace;
        saveWorkspace(workspace);
        return workspace;
    });

    ipcMain.handle("collection:create", (_, name) => {
        ensureWorkspace();

        const collection = createCollection(name);
        workspace.collections.push(collection);

        saveWorkspace(workspace);
        return collection;
    });

    ipcMain.handle("environment:create", (_, name) => {
        ensureWorkspace();

        const env = createEnvironment(name);
        workspace.environments.push(env);

        saveWorkspace(workspace);
        return env;
    });

    ipcMain.handle("environment:setActive", (_, envId) => {
        ensureWorkspace();

        workspace.activeEnvironmentId = envId;
        saveWorkspace(workspace);

        return workspace;
    });

    ipcMain.handle("request:create", (_, {collectionId, name}) => {
        ensureWorkspace();

        const request = createRequest(name, collectionId);

        workspace.requests.push(request);

        const collection = workspace.collections.find(
            c => c.id === collectionId
        );

        if (collection) {
            collection.requestIds.push(request.id);
        }

        saveWorkspace(workspace);
        return request;
    });

    ipcMain.handle("http:send", async (_, requestId) => {
        ensureWorkspace();

        const request = workspace.requests.find(r => r.id === requestId);
        if (!request) {
            throw new Error("Request not found");
        }

        const activeEnv = workspace.environments.find(
            env => env.id === workspace.activeEnvironmentId
        );

        const variables = activeEnv ? activeEnv.variables : [];

        let resolvedUrl = resolveVariables(request.url, variables);

        const resolvedHeaders = new Headers();

        request.headers
            .filter(h => h.enabled)
            .forEach(h => {
                resolvedHeaders.set(
                    h.key,
                    resolveVariables(h.value, variables)
                );
            });

        const effectiveAuth = resolveRequestAuth(workspace, request);
        const resolvedAuth = resolveAuthVariables(effectiveAuth, variables);

        const hasManualAuth = resolvedHeaders.has("Authorization");

        if (!hasManualAuth) {
            if (resolvedAuth.type === "basic") {
                const { username = "", password = "" } = resolvedAuth.config;

                const token = Buffer
                    .from(`${username}:${password}`)
                    .toString("base64");

                resolvedHeaders.set("Authorization", `Basic ${token}`);
            }

            if (resolvedAuth.type === "bearer") {
                const { token = "" } = resolvedAuth.config;
                resolvedHeaders.set("Authorization", `Bearer ${token}`);
            }
        }

        if (resolvedAuth.type === "api") {
            const { key = "", value = "", in: location } = resolvedAuth.config;

            if (location === "header" && key) {
                resolvedHeaders.set(key, value);
            }

            if (location === "query" && key) {
                const url = new URL(resolvedUrl);
                url.searchParams.set(key, value);
                resolvedUrl = url.toString();
            }
        }

        let resolvedBody;

        if (request.body?.type !== "none" && request.method !== "GET") {
            resolvedBody = resolveVariables(
                request.body.content,
                variables
            );
        }

        const controller = new AbortController();
        activeRequests.set(requestId, controller);

        const start = Date.now();

        try {
            console.log(resolvedUrl, {
                method: request.method,
                headers: resolvedHeaders,
                body: resolvedBody,
                signal: controller.signal})
            const response = await fetch(resolvedUrl, {
                method: request.method,
                headers: resolvedHeaders,
                body: resolvedBody,
                signal: controller.signal
            });

            const text = await response.text();
            const duration = Date.now() - start;

            activeRequests.delete(requestId);

            return {
                status: response.status,
                statusText: response.statusText,
                headers: Object.fromEntries(response.headers.entries()),
                body: text,
                duration
            };
        } catch (err) {
            activeRequests.delete(requestId);

            if (err.name === "AbortError") {
                return { aborted: true };
            }

            throw err;
        }
    });

    ipcMain.handle("http:cancel", (_, requestId) => {
        const controller = activeRequests.get(requestId);

        if (controller) {
            controller.abort();
            activeRequests.delete(requestId);
        }

        return true;
    });
}

