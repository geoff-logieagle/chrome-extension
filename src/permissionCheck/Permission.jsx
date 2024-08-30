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
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: micGranted,
                video: camGranted,
            });

            // const devicesInfo = await navigator.mediaDevices.enumerateDevices();

            // let audioinput = [];
            // let audiooutput = [];
            // let videoinput = [];

            // if (micGranted) {
            //     // Filter by audio input
            //     audioinput = devicesInfo
            //         .filter((device) => device.kind === "audioinput")
            //         .map((device) => ({
            //             deviceId: device.deviceId,
            //             label: device.label,
            //         }));

            //     // Filter by audio output and extract relevant properties
            //     audiooutput = devicesInfo
            //         .filter((device) => device.kind === "audiooutput")
            //         .map((device) => ({
            //             deviceId: device.deviceId,
            //             label: device.label,
            //         }));
            // }

            // if (camGranted) {
            //     // Filter by video input and extract relevant properties
            //     videoinput = devicesInfo
            //         .filter((device) => device.kind === "videoinput")
            //         .map((device) => ({
            //             deviceId: device.deviceId,
            //             label: device.label,
            //         }));
            // }


            // Post message to parent window
            window.parent.postMessage(
                {
                    type: "permissions",
                    success: true,
                    cameraPermission: camGranted,
                    microphonePermission: micGranted,
                },
                "*"
            );

            // End the stream
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
