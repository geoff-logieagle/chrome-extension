import React, { useEffect, useState, useRef, useContext } from "react";
import Draggable from 'react-draggable';

function CameraWrap() {
    const videoRef = useRef(null);
    useEffect(() => {
        async function requestUserMedia() {
            const [videoStream, audioStream] = await Promise.all([
                navigator.mediaDevices.getUserMedia({ video: stream.videoStream })
                    .then(stream => {
                        return stream;
                    })
                    .catch(() => null),
                // { echoCancellation: true }
                navigator.mediaDevices.getUserMedia({ audio: stream.audioStream })
                    .then(stream => {
                        return stream;
                    })
                    .catch(() => null)
            ]);

            const tracks = [];
            const audiotrack = [];
            spinnerRef.current.style.display = 'none'
            if (videoStream && audioStream) {
                tracks.push(...videoStream.getVideoTracks());
                audiotrack.push(...audioStream.getAudioTracks())
                const videoStreamOnly = new MediaStream(tracks);
                const audioStreamOnly = new MediaStream(audiotrack);
                setCameraStream(videoStreamOnly);
                setAudioStream(audioStreamOnly);
                if (videoRef.current) {
                    videoRef.current.srcObject = videoStream;
                }

            }
            if (videoStream && !audioStream) {
                tracks.push(...videoStream.getVideoTracks());
                const videoStreamOnly = new MediaStream(tracks);
                setCameraStream(videoStreamOnly);
                if (videoRef.current) {
                    videoRef.current.srcObject = videoStream;
                }
            }
            if (!videoStream && audioStream) {
                audiotrack.push(...audioStream.getAudioTracks());
                const audioStreamOnly = new MediaStream(audiotrack);
                setAudioStream(audioStreamOnly);
            }


        }
        requestUserMedia();
    }, []);

    return (<>
        <Draggable bounds='parent'>
            <div className="circular-img" id='circular-img'>
                <video ref={videoRef} className='getTheVideo' width="100%" height="100%" autoPlay></video>
            </div>
        </Draggable>
    </>)
}

export default CameraWrap;