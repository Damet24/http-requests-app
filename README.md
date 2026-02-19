# Request App

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Electron](https://img.shields.io/badge/Electron-Desktop-47848F)
![React](https://img.shields.io/badge/React-19-61DAFB)
![Vite](https://img.shields.io/badge/Vite-5-646CFF)
![Zustand](https://img.shields.io/badge/State-Zustand-000000)
![CodeMirror](https://img.shields.io/badge/Editor-CodeMirror-orange)
![Tailwind](https://img.shields.io/badge/Style-Tailwind-38BDF8)

A modern desktop HTTP client built with **Electron + React + Vite** that allows you to create, organize, and execute HTTP requests with full environment support.

---

## 🚀 Features

* Create, edit, and execute HTTP requests
* Organize requests into collections
* Environment-based variables
* CodeMirror-powered request body and response editor
* Automatic `Content-Type` handling
* Resizable split panels (request/response view)
* Local workspace persistence
* Clean, modular architecture

---

## 🏗 Architecture

```
Electron Main Process
        │
     Preload (IPC bridge)
        │
     React Renderer
        │
     Zustand Global Store
        │
 File-based Persistence Layer
```

---

## 🛠 Tech Stack

* Electron
* React 19
* Vite
* Zustand
* CodeMirror
* Tailwind CSS
* react-resizable-panels

---

## 📦 Installation

```bash
pnpm install
pnpm start
```

---

## 🧪 Scripts

| Command        | Description                  |
| -------------- | ---------------------------- |
| `pnpm start`   | Run in development mode      |
| `pnpm package` | Package the application      |
| `pnpm make`    | Generate platform installers |
| `pnpm publish` | Publish build artifacts      |

---

## 📂 Project Structure

```
src/
 ├── main.js
 ├── preload.js
 ├── renderer.jsx
 ├── application/
 ├── infrastructure/
 ├── store/
 └── ui/
```