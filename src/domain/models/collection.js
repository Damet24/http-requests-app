import {randomUUID} from "crypto";

export function createCollection(name) {
    return {
        id: randomUUID(),
        name,
        auth: {
            type: "none",
            config: {}
        },
        requestIds: []
    };
}
