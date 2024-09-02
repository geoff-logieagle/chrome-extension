import React, { useEffect, useState, useRef } from 'react';
import '../global.css';

function Preview() {
    const linkVideoRef = useRef(null);
    const blobObject = useRef(null);
    const videoTypes = [
        'video/mp4',
        'video/webm',
        'video/x-msvideo',
        'video/quicktime',
        'video/x-matroska'
    ];
    const [selectedType, setSelectedType] = useState(videoTypes[0]);
    const downloadRef = useRef(null);
    const handleTypeChange = (event) => {
        setSelectedType(event.target.value);
    };

    function base64ToBlob(base64, mimeType) {
        const base64Data = base64.includes(',') ? base64.split(',')[1] : base64;
        const paddedBase64 = base64Data.padEnd(base64Data.length + (4 - (base64Data.length % 4)) % 4, '=');
        const byteCharacters = atob(paddedBase64);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        blobObject.current = new Blob([byteArray], { type: mimeType });
    }

    // const downloadVideo = () => {
    //     const videoBlob = new Blob([blobObject.current], { type: selectedType });
    //     const url = window.URL.createObjectURL(videoBlob);
    //     const a = document.createElement('a');
    //     a.href = url;
    //     a.download = 'CapturedVideo';
    //     document.body.appendChild(a);
    //     a.click();
    //     document.body.removeChild(a);
    //     window.URL.revokeObjectURL(url)
    // }

    const downloadVideo = () => {
        const videoBlob = new Blob([blobObject.current], { type: selectedType });
        const url = window.URL.createObjectURL(videoBlob);
        if (downloadRef.current) {
            downloadRef.current.href = url;
            downloadRef.current.download = 'CapturedVideo';
        }
        setTimeout(() => {
            window.URL.revokeObjectURL(url);
        }, 10000);
    };

    chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
        debugger
        if (message.action === 'linkcamera') {
            linkVideoRef.current.src = message.text;
            const mimeType = "video/x-matroska;codecs=avc1,opus";
            base64ToBlob(linkVideoRef.current.src, mimeType);
        }
    })

    return (
        <>
            <div style={{ width: '1200px', height: '600px', margin: '0 auto' }}>
                <video ref={linkVideoRef} controls className='getTheVideo' width="100%" height="100%" autoPlay></video>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px', marginTop: '20px' }}>
                    <select style={{ borderRadius: '30px', padding: '10px' }} id="videoTypeSelect" value={selectedType} onChange={handleTypeChange}>
                        {videoTypes.map((type) => (
                            <option key={type} value={type}>
                                {type}
                            </option>
                        ))}
                    </select>
                    <div class="button">
                        <a className='downloadButton' ref={downloadRef} onClick={downloadVideo} href="#">Download</a>
                    </div>
                </div>
            </div>
        </>
    )
}
export default Preview;