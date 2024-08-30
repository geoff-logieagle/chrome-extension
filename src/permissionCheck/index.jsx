import React from "react";
import { createRoot } from "react-dom/client";
// @ts-ignore
import Permission from "./Permission.jsx";

const container = document.getElementById('permission-root');
const root = createRoot(container);
root.render(<Permission />);

