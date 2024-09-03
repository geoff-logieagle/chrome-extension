import React from "react";
import { createRoot } from "react-dom/client";
import Camera from "./Camera";
const element = document.getElementById('camera-root');

if (!element) {
    const container = document.createElement('div')
    container.id = 'camera-root'
    document.body.appendChild(container)
    const root = createRoot(container);
    root.render(<Camera />);
}
