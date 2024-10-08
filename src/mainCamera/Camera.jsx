import React, { useEffect, useState, useRef } from 'react';
import Draggable from 'react-draggable';
import { Rnd } from "react-rnd";
import '../global.css';

function Camera() {
    const draggableRef = useRef(null);
    const videoRef = useRef(null);
    const mediaRecorderRef = useRef(null);
    const RecordingStarted = useRef(false);
    const recordedChunksRef = useRef([]);
    const [isRecording, setIsRecording] = useState(false);
    const [cameraStream, setCameraStream] = useState(null);
    const [AudioStream, setAudioStream] = useState(null);
    const [displayStream, setDisplayStream] = useState(null);
    const countdownRef = useRef(null);
    const ringRef = useRef(null);
    const vcOverlay = useRef(null);

    useEffect(() => {
        async function requestUserMedia() {
            const [videoStream, audioStream] = await Promise.all([
                navigator.mediaDevices.getUserMedia({ video: true })
                    .then(stream => {
                        return stream;
                    })
                    .catch(() => null),
                navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true } })
                    .then(stream => {
                        return stream;
                    })
                    .catch(() => null)
            ]);

            const tracks = [];
            const audiotrack = [];

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

    useEffect(() => {
        window.handleStopRecording = handleStopRecording;
        return () => {
            delete window.handleStopRecording;
        };
    }, [isRecording]);

    const handleStartRecording = async () => {
        debugger;
        const displayMediaStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        setDisplayStream(displayMediaStream);
        const audioContext = new AudioContext();
        const output = audioContext.createMediaStreamDestination();
        RecordingStarted.current = true;
        if (AudioStream) {
            const audioTracks = [
                ...AudioStream.getAudioTracks()
            ];

            audioTracks.forEach(track => {
                const source = audioContext.createMediaStreamSource(new MediaStream([track]));
                source.connect(output);
            });

        }
        const combinedStream = new MediaStream([
            ...displayMediaStream.getVideoTracks(),
            ...(AudioStream ? output.stream.getAudioTracks() : []),
        ]);

        const mediaRecorder = new MediaRecorder(combinedStream, {
            mimeType: "video/webm",
        });

        mediaRecorderRef.current = mediaRecorder;

        mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
                recordedChunksRef.current.push(event.data);
            }
        };

        displayMediaStream.getVideoTracks()[0].onended = async function () {
            handleStopRecording();
        };

        const texts = countdownRef.current.querySelectorAll("span");

        texts.forEach((span) => {
            span.style.opacity = 0;
            span.style.transform = "scale(0)";
        });
        vcOverlay.current.style.opacity = 1;
        ringRef.current.style.opacity = 1;

        texts[0].style.opacity = 1;
        texts[0].style.transform = "scale(1)";


        setTimeout(() => {
            texts[0].style.opacity = 0;
            texts[1].style.opacity = 1;
            texts[1].style.transform = "scale(1)";
            setTimeout(() => {
                texts[1].style.opacity = 0;
                texts[2].style.opacity = 1;
                texts[2].style.transform = "scale(1)";
                setTimeout(() => {
                    texts[2].style.opacity = 0;
                    ringRef.current.style.opacity = 0;
                    vcOverlay.current.style.opacity = 0;

                    mediaRecorder.start();
                    chrome.runtime.sendMessage({
                        action: "startedRecording",
                    });
                    setIsRecording(true);
                }, 1000);
            }, 1000);

        }, 1000);



        // mediaRecorder.start();
        // chrome.runtime.sendMessage({
        //     action: "startedRecording",
        // });

        // setIsRecording(true);
    };

    const convertBlobToBase64 = (blob) => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.readAsDataURL(blob);
            reader.onloadend = () => {
                const base64data = reader.result;
                resolve(base64data);
            };
        });
    };

    const fetchBlob = async (url) => {
        const response = await fetch(url);
        const blob = await response.blob();
        const base64 = await convertBlobToBase64(blob);
        return base64;
    };

    const handleStopRecording = async () => {
        if (mediaRecorderRef.current) {
            mediaRecorderRef.current.stop();
            mediaRecorderRef.current.onstop = async () => {
                const blob = new Blob(recordedChunksRef.current, { type: 'video/mp4' });
                const bas364 = await fetchBlob(URL.createObjectURL(blob));
                recordedChunksRef.current = [];
                mediaRecorderRef.current = null;
                setIsRecording(false);
                RecordingStarted.current = false;
                [displayStream, cameraStream, AudioStream].forEach(stream => {
                    if (stream) {
                        stream.getTracks().forEach(track => track.stop());
                    }
                });
                setDisplayStream(null);
                setCameraStream(null);
                setAudioStream(null);
                chrome.runtime.sendMessage({ action: "sendingData", text: bas364 });
            };
        }
    };

    return (
        <>
            <Rnd>
                <div style={{ margin: '0px !important' }} ref={draggableRef} id="higherOrder">
                    <div className="circular-img" id='circular-img'>
                        <video ref={videoRef} className='getTheVideo' width="100%" height="100%" autoPlay></video>
                    </div>

                    <div className="vc-controls-container">
                        <div className="inner-cntrl-cont" style={{ left: '100px', transform: 'translate(100px)' }}>
                            <div className="vc-controls">
                                <div className="controls-inner">
                                    {
                                        !isRecording && <button
                                            id="startStopBtn"
                                            onClick={handleStartRecording}
                                        >
                                            <span className="btn-control-icon">
                                                <svg viewBox="6 0 11.999750137329102 24" fill="none">
                                                    <path
                                                        d="M6 6.134v11.732c0 .895 1.03 1.438 1.822.951l9.628-5.866c.733-.441.733-1.46 0-1.914L7.822 5.183C7.029 4.696 6 5.239 6 6.134z"
                                                        fill="currentColor"
                                                    ></path>
                                                </svg>
                                            </span>
                                        </button>
                                    }
                                    {
                                        isRecording && <button
                                            onClick={handleStopRecording}
                                            id="cancelBtn"
                                        >
                                            <svg viewBox="4 0 16 24" fill="none"><rect x="4" y="4" width="16" height="16" rx="2" fill="currentColor"></rect></svg>
                                        </button>
                                    }

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Rnd>
            {
                !isRecording && <div className="recorder-container">
                    <div className="glass-card">
                        <div className="card-content">
                            <h1>Welcome</h1>
                            <div className="record-button-container">
                                <button className="cool-button btn-1 ss" data-disable={isRecording ? 'disable' : 'notdisable'} onClick={handleStartRecording}>Start</button>
                            </div>
                        </div>
                    </div>
                </div >
            }


            <div class="vc-overlay" ref={vcOverlay}><div ref={ringRef} id="ring"></div><div ref={countdownRef} id="countdown"><span>3</span><span >2</span><span >1</span></div></div>
        </>



    )
}

export default Camera;