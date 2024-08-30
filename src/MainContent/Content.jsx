import React from "react";
import { createRoot } from "react-dom/client";
import StreamProvider from "../StreamProvider.jsx";
import Permission from "../permissioncheck/Permission.jsx";
import Camera from "../mainCamera/Camera.jsx";

const MainContent = () => {
    return (
        <div id="main-content">
            <Permission />
        </div>
    )
}
const root = createRoot(document.getElementById('permission-root'));
root.render(<MainContent />);

export default MainContent;
