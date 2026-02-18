import fs from "node:fs";
import path from "node:path";
import { app } from "electron";

const filePath = path.join(app.getPath("userData"), "workspace.json");

export function loadWorkspace() {
    if (!fs.existsSync(filePath)) {
        return null;
    }

    const data = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(data);
}

export function saveWorkspace(workspace) {
    fs.writeFileSync(filePath, JSON.stringify(workspace, null, 2));
}
