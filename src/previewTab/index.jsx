import React from "react";
import { createRoot } from "react-dom/client";
import Preview from "./Preview.jsx";

const container = document.createElement('div');
container.id = 'preview-root';
document.body.appendChild(container);
const root = createRoot(container)
root.render(<Preview />)

