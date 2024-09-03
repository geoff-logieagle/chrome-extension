import React from "react";
import { createRoot } from "react-dom/client";
import { render } from "react-dom";
import CameraWrap from "./CameraWrap.jsx";

const root = createRoot(document.getElementById('camera-wrapper'));
root.render(<CameraWrap />);


// // Render at the end of the body of any website
// render(<CameraWrap />, window.document.querySelector("#app-container"));

// if (module.hot) module.hot.accept();
