import { randomUUID } from "crypto";

export function createEnvironment(name) {
    return {
        id: randomUUID(),
        name,
        variables: []
    };
}

export function createVariable(key, value) {
    return {
        id: randomUUID(),
        key,
        value,
        enabled: true
    };
}
