import React from "react";
import { createRoot } from "react-dom/client";
import TabCamera from "./TabCamera.jsx";
import '../global.css'

const element = document.getElementById('tab-camera-root');

if (!element) {
    const container = document.createElement('div');
    container.id = 'tab-camera-root';
    document.body.appendChild(container);
    const root = createRoot(container);
    root.render(<TabCamera />);

}

