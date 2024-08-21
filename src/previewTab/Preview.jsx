import React, { useEffect, useState, useRef } from 'react';

function Preview() {
    const linkVideoRef = useRef(null);
    chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
        if (message.action === 'linkcamera') {
            linkVideoRef.current.src = message.text;
        }
    })
    return (
        <>
            <div style={{ width: '1200px', margin: '0 auto' }}>
                <video ref={linkVideoRef} controls className='getTheVideo' width="100%" height="100%" autoPlay></video>
            </div>
        </>
    )
}
export default Preview;