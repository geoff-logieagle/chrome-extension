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

                    <div className="vc-controls-container">
                        <div className="inner-cntrl-cont" style={{ left: '100px', transform: 'translate(100px)' }}>
                            <div className="vc-controls">
                                <div className="controls-inner">
                                    <button
                                        id="startStopBtn"
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
                                    <button
                                        id="cancelBtn"
                                    >
                                        <svg viewBox="4 0 16 24" fill="none"><rect x="4" y="4" width="16" height="16" rx="2" fill="currentColor"></rect></svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

            </Draggable>
        </>)
}

export default Camera;