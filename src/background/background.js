let initalLoad = false;
let activeCurrentTab;
let linkTabiD = null;
let startedRecording = false;
let intialHtml;

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
    if (message.action === "startedRecording") {
        linkTabiD = null;
        startedRecording = true;
    }
    if (message.action == 'sendingData') {
        startedRecording = false;
        initalLoad = false;
        chrome.tabs.create({ url: chrome.runtime.getURL('preview.html') }, function (tab) {
            linkTabiD = tab.id;
            chrome.tabs.onUpdated.addListener(function listener(tabId, info) {
                if (info.status === 'complete') {
                    chrome.runtime.sendMessage({ action: "linkcamera", text: message.text });
                }
            });
        });
    }
    if (message.action === "stopRecording") {
        chrome.scripting.executeScript({
            target: { tabId: activeCurrentTab },
            func: () => {
                if (window.handleStopRecording) {
                    window.handleStopRecording();
                }
            }
        });
    }
    if (message.action === 'stopRecording' || message.action === 'sendingData') {
        await removeIframesFromAllTabs();
    }

    if (message.action === 'deleteCamera') {
        await removeIframesFromAllTabs();
    }

    if (message.action === 'injectCamera') {
        chrome.scripting.executeScript({
            target: { tabId: activeCurrentTab },
            func: () => {
                console.log("dfgfd");
                if (window.requestUserMedia) {
                    window.requestUserMedia();
                }
            }
        });
    }
});

chrome.action.onClicked.addListener((tab) => {
    debugger
    if (!tab.url.startsWith("chrome://") && !tab.url.startsWith("chrome-extension://")) {
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            files: ['camera.js']
        }, () => {
            activeCurrentTab = tab.id;
            initalLoad = true;
            console.log(activeCurrentTab, initalLoad);
        });
    }
});

chrome.tabs.onActivated.addListener(function (activeInfo) {
    debugger
    chrome.tabs.get(activeInfo.tabId, function (tab) {
        if (!tab.url.startsWith("chrome://") && !tab.url.startsWith("chrome-extension://") &&
            initalLoad && activeCurrentTab != activeInfo.tabId && startedRecording && linkTabiD == null) {
            chrome.scripting.executeScript({
                target: { tabId: activeInfo.tabId },
                files: ['tabcamera.js']
            }, () => { });
        }
    });
});

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
     debugger
    if (changeInfo.status === 'complete' &&
        !tab.url.startsWith("chrome://") && !tab.url.startsWith("chrome-extension://") &&
        initalLoad && startedRecording && activeCurrentTab !== tabId && linkTabiD == null) {
        chrome.scripting.executeScript({
            target: { tabId: tabId },
            files: ['tabcamera.js']
        }, () => { });
    }
});

async function removeIframesFromAllTabs() {
    const tabs = await chrome.tabs.query({});
    await Promise.all(tabs.map(async (tab) => {
        if (!tab.url.startsWith("chrome://") && !tab.url.startsWith("chrome-extension://")) {
            await chrome.scripting.executeScript({
                target: { tabId: tab.id },
                func: () => {
                    const iframeAnother = document.getElementById('camera-root');
                    const iframe = document.getElementById('tab-camera-root');
                    if (iframe) {
                        iframe.remove();
                    }
                    if (iframeAnother) {
                        iframeAnother.remove();
                    }

                    if (window.StopCamera) {
                        window.StopCamera();
                    }
                }
            });
        }
    }));
}
