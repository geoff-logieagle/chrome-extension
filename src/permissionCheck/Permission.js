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
    chrome.storage.local.set({
        videoStream: videoStream,
        audioStream: audioStream,
    });

    chrome.runtime.sendMessage({ action: "injectCamera" });
}

requestUserMedia();