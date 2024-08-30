// import React from "react";
// import { createRoot } from "react-dom/client";
// import MainContent from "./Content.jsx";

const element = document.getElementById('camera-root');
const iframe = document.createElement('iframe');
iframe.src = chrome.runtime.getURL("permission.html");
iframe.setAttribute('allow', 'camera; microphone; display-capture');
element.appendChild(iframe);
