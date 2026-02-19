# request-app

Desktop application (Electron + Vite + React) to create and manage HTTP requests, collections, and environments.

## Overview

- **Author:** Daniel Mercado  
- **Version:** 1.0.0  
- **License:** MIT  

## Features

- Create/edit/execute HTTP requests  
- Group requests into collections  
- Environment management (environment-based variables)  
- Code editor (CodeMirror) for request body and response  
- Headers and response viewer  

## Main Technologies

- Electron  
- Vite  
- React 19  
- CodeMirror  
- Tailwind CSS  
- Zustand (state management)  

## Requirements

- Node.js and `pnpm` installed on the system.

## Installation and Run (Development)

Install dependencies:

```bash
pnpm install
````

Start the application in development mode:

```bash
pnpm run start
```

Available commands (defined in `package.json`):

* `start` — Runs the app in development mode (`electron-forge start`).
* `package` — Packages the application (`electron-forge package`).
* `make` — Generates installers (`electron-forge make`).
* `publish` — Publishes packages (`electron-forge publish`).
* `lint` — Placeholder for linting.

## Project Structure (Summary)

* [src/main.js](src/main.js) — Main process (Electron main).
* [src/preload.js](src/preload.js) — Preload script for contextBridge / IPC.
* [src/renderer.jsx](src/renderer.jsx) — Renderer entry point (UI).
* [src/application](src/application) — Domain logic and models.
* [src/infrastructure/persistence/fileStorage.js](src/infrastructure/persistence/fileStorage.js) — File-based persistence.
* [src/lib/utils.js](src/lib/utils.js) — Shared utilities.
* [src/store/workspaceStore.js](src/store/workspaceStore.js) — Global state with `zustand`.
* [src/ui/components](src/ui/components) — Main UI components (`RequestPanel`, `CollectionsList`, etc.).

For more implementation details, review the components in [src/ui/components](src/ui/components).

## How to Contribute

* Create a branch per feature: `git checkout -b feat/my-change`.
* Open a pull request with a clear description and reproduction steps.

## Notes and Recommendations

* The project uses `pnpm` for speed and due to the `pnpm` configuration in `package.json`.
* If you need to generate a production build, use `pnpm run package` and/or `pnpm run make`.