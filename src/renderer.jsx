import {createRoot} from 'react-dom/client';
import './index.css'
import {App} from "./App";
import {debouncedSave} from "./store/workspaceStore";

const container = document.querySelector('#root');
const root = createRoot(container);
root.render(<App/>)

window.addEventListener("beforeunload", () => {
    debouncedSave.flush();
});
