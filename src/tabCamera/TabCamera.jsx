import React, { useEffect, useState, useRef } from 'react';
import Draggable from 'react-draggable';

function TabCamera() {
    const previewDraggableRef = useRef(null);
    const previewVideoRef = useRef(null);
    const [cameraStream, setCameraStream] = useState(null);

    useEffect(() => {
        async function requestUserMedia() {
            const userMediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
            const tracks = [];
            if(userMediaStream){
                tracks.push(...userMediaStream.getVideoTracks());
                const combinedStream = new MediaStream(tracks);
                setCameraStream(combinedStream);
                if (previewVideoRef.current) {
                    previewVideoRef.current.srcObject = userMediaStream;
                }
            }
          
        }
        requestUserMedia();
    }, []);

    useEffect(() => {
        window.StopCamera = StopCamera;
        return () => {
            delete window.StopCamera;
        };
    }, [StopCamera,cameraStream]);

    const StopRecording = () => {
        chrome.runtime.sendMessage({ action: "stopRecording" });
    }

    const StopCamera = () => {
        if (cameraStream) {
            cameraStream.getTracks().forEach(track => track.stop());
            setCameraStream(null);
        }
    }


    return (
        <Draggable nodeRef={previewDraggableRef} bounds='parent'>
            <div style={{ margin: '0px !important' }} ref={previewDraggableRef}>
                <div className="circular-img" id='circular-img'>
                    <video ref={previewVideoRef} className='getTheVideo' width="100%" height="100%" autoPlay></video>
                </div>
                <div className="vc-controls-container">
                    <div className="inner-cntrl-cont" style={{ left: '100px', transform: 'translate(100px)' }}>
                        <div className="vc-controls">
                            <div className="controls-inner">
                                <button
                                    onClick={StopRecording}
                                >
                                    <svg viewBox="4 0 16 24" fill="none"><rect x="4" y="4" width="16" height="16" rx="2" fill="currentColor"></rect></svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </Draggable>
    )
}

export default TabCamera;