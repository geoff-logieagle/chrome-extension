import React from "react";
import { createRoot } from "react-dom/client";
import Camera from "./Camera.jsx";

const element = document.getElementById('camera-root');

if (!element) {
    const container = document.createElement('div');
    container.id = 'camera-root';
    document.body.appendChild(container);
    // const iframe = document.createElement('iframe');
    // iframe.src = chrome.runtime.getURL("permission.html");
    // iframe.setAttribute('allow', 'camera; microphone; display-capture');
    // iframe.style.visibility = 'hidden';
    // document.body.appendChild(iframe);
    const root = createRoot(container);
    root.render(<Camera />);
}
