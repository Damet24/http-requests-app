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

export function registerIpcHandlers() {
    // Load workspace
    ipcMain.handle("workspace:load", () => {
        ensureWorkspace();
        return workspace;
    });

    // Save workspace
    ipcMain.handle("workspace:save", (_, newWorkspace) => {
        workspace = newWorkspace;
        saveWorkspace(workspace);
        return workspace;
    });

    // Create collection
    ipcMain.handle("collection:create", (_, name) => {
        ensureWorkspace();

        const collection = createCollection(name);
        workspace.collections.push(collection);

        saveWorkspace(workspace);
        return collection;
    });

    // Create environment
    ipcMain.handle("environment:create", (_, name) => {
        ensureWorkspace();

        const env = createEnvironment(name);
        workspace.environments.push(env);

        saveWorkspace(workspace);
        return env;
    });

    // Set active environment
    ipcMain.handle("environment:setActive", (_, envId) => {
        ensureWorkspace();

        workspace.activeEnvironmentId = envId;
        saveWorkspace(workspace);

        return workspace;
    });

    // Create request
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

        console.log(activeEnv);
        console.log(request);

        const variables = activeEnv ? activeEnv.variables : [];

        const resolvedUrl = resolveVariables(request.url, variables);

        console.log(resolvedUrl);

        const resolvedHeaders = {};
        request.headers
            .filter(h => h.enabled)
            .forEach(h => {
                resolvedHeaders[h.key] = resolveVariables(h.value, variables);
            });

        const resolvedBody =
            request.body?.type !== "none"
                ? resolveVariables(request.body.content, variables)
                : undefined;

        const controller = new AbortController();
        activeRequests.set(requestId, controller);

        const start = Date.now();

        try {
            console.log(resolvedUrl, {
                method: request.method,
                headers: resolvedHeaders,
                body: request.method !== "GET" ? resolvedBody : undefined,
                signal: controller.signal
            })
            const response = await fetch(resolvedUrl, {
                method: request.method,
                headers: resolvedHeaders,
                body: request.method !== "GET" ? resolvedBody : undefined,
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

