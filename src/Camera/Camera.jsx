import Draggable from 'react-draggable';
import '../global.css'
function Camera() {
    return (
        <>
            <Draggable bounds='parent'>
                <div className='content'>
                    <div className='camera-wrapper'>
                        <iframe
                            style={{ pointerEvents: 'none', width: '100%', height: '100%', border: '0px', borderRadius: '50%' }}
                            src={chrome.runtime.getURL("camera.html")}
                            allow="camera;microphone"
                        >
                        </iframe>
                    </div>

                </div>

            </Draggable>
        </>)
}

export default Camera;