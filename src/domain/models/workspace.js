import {randomUUID} from "crypto";

export function createWorkspace(name = "My Workspace") {
    return {
        id: randomUUID(),
        name,
        activeEnvironmentId: null,
        environments: [],
        collections: [],
        requests: []
    };
}
