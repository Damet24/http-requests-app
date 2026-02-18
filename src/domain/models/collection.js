import { randomUUID } from "crypto";

export function createCollection(name) {
    return {
        id: randomUUID(),
        name,
        requestIds: []
    };
}
