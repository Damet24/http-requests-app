import { randomUUID } from "crypto";

export function createRequest(name, collectionId) {
    return {
        id: randomUUID(),
        name,
        collectionId,
        method: "GET",
        url: "",
        headers: [],
        auth: {
            type: "none",
            config: {}
        },
        body: {
            type: "none",
            config: null
        }
    };
}
