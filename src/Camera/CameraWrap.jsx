import React, { useEffect, useState, useRef, useContext } from "react";
import "../global.css"

function CameraWrap() {
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
    const spinnerRef = useRef(null);

    useEffect(() => {
        async function requestUserMedia() {
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: true,
                video: true,
            });

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

            stream.getTracks().forEach(function (track) {
                track.stop();
            });

            const tracks = [];
            const audiotrack = [];
            // spinnerRef.current.style.display = 'none'
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
        chrome.runtime.sendMessage({
            action: "startedRecording",
        });
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
        vcOverlay.current.style.visibility = 'visible';
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
                    vcOverlay.current.style.visibility = 'hidden';
                    mediaRecorder.start();

                    setIsRecording(true);
                }, 1000);
            }, 1000);

        }, 1000);
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
        debugger
        if (mediaRecorderRef.current) {
            mediaRecorderRef.current.stop();
            mediaRecorderRef.current.onstop = async () => {
                console.log(recordedChunksRef.current);
                const blob = new Blob(recordedChunksRef.current, { type: 'video/mp4' });
                const bas364 = await fetchBlob(URL.createObjectURL(blob));
                setIsRecording(false);
                RecordingStarted.current = false;
                chrome.runtime.sendMessage({ action: "sendingData", text: bas364 });
                recordedChunksRef.current = [];
                mediaRecorderRef.current = null;
                [displayStream, cameraStream, AudioStream].forEach(stream => {
                    if (stream) {
                        stream.getTracks().forEach(track => track.stop());
                    }
                });
                setDisplayStream(null);
                setCameraStream(null);
                setAudioStream(null);
            };
        }
    };

    document.addEventListener("click", async (e) => {
        debugger;
        var cameraElement = document.getElementById('higherOrder');
        var controlsEle = document.querySelector('.vc-controls');
        var controls = document.querySelector('.glass-card');
        if ((cameraElement && !cameraElement?.contains(e.target) && !controlsEle?.contains(e.target) && !controls?.contains(e.target)) && !RecordingStarted.current) {
            chrome.runtime.sendMessage({ action: "deleteCamera" });
        }
    });

    return (
        <>
            <div className="circular-img" id='circular-img'>
                <video style={{ objectFit: 'cover' }} ref={videoRef} className='getTheVideo' width="100%" height="100%" autoPlay></video>
            </div>
        </>
    )
}




export default CameraWrap;