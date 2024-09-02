import React, { useEffect, useState, useRef, useCallback } from "react";

const Permission = () => {
    const checkPermissions = async () => {
        debugger
        // Individually check the camera and microphone permissions using the Permissions API. Then enumerate devices respectively.
        try {
            const cameraPermission = await navigator.permissions.query({
                name: "camera",
            });
            const microphonePermission = await navigator.permissions.query({
                name: "microphone",
            });

            cameraPermission.onchange = () => {
                checkPermissions();
            };

            microphonePermission.onchange = () => {
                checkPermissions();
            };

            // If the permissions are granted, enumerate devices
            if (
                cameraPermission.state === "granted" ||
                microphonePermission.state === "granted"
            ) {
                enumerateDevices(
                    cameraPermission.state === "granted",
                    microphonePermission.state === "granted"
                );


            }
            else {
                // Post message to parent window
                window.parent.postMessage(
                    {
                        type: "permissions",
                        success: false,
                        error: err.name,
                    },
                    "*"
                );
                // sendResponse({ success: false, error: err.name });
            }
        } catch (err) {
            enumerateDevices();
        }
    };

    // Enumerate devices
    const enumerateDevices = async (camGranted = true, micGranted = true) => {
        debugger;
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: micGranted,
                video: camGranted,
            });
            window.parent.postMessage(
                {
                    type: "permissions",
                    success: true,
                    cameraPermission: camGranted,
                    microphonePermission: micGranted,
                },
                "*"
            );
            stream.getTracks().forEach(function (track) {
                track.stop();
            });
        } catch (err) {
            // Post message to parent window
            window.parent.postMessage(
                {
                    type: "permissions",
                    success: false,
                    error: err.name,
                },
                "*"
            );
        }
    };

    // Post message listener
    // const onMessage = (message) => {
    //     checkPermissions();
    // };

    // Post message listener
    useEffect(() => {
        checkPermissions();
        // window.addEventListener("message", (event) => {
        //     onMessage(event.data);
        // });
    }, []);

    return <div></div>;
};

export default Permission;
