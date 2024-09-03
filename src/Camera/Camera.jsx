
function Camera() {
    return (
        <>
            <iframe
                src={chrome.runtime.getURL("camera.html")}
            >
            </iframe>
        </>)
}

export default Camera;