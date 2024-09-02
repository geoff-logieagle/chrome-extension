import React, { createContext, useContext, useEffect, useState } from 'react';
export const StreamContext = createContext();

const StreamProvider = (props) => {
    debugger;
    const [permission, setPermission] = useState(false);
    const [stream, setStream] = useState({
        videoStream: false,
        audioStream: false
    });

    useEffect(() => {
        const handleMessage = (event) => {
            debugger;
            if (event.data.type === "permissions") {
                setStream({ videoStream: event.data.cameraPermission, audioStream: event.data.microphonePermission });
                setPermission(true)
            }
        };
        window.addEventListener("message", handleMessage);
        return () => {
            window.removeEventListener("message", handleMessage);
        };
    }, []);

    return (
        <StreamContext.Provider value={[stream, setStream]}>
            {props.children}
        </StreamContext.Provider >
    );
};

export default StreamProvider;
