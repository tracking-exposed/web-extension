chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === 'chromeConfig') {
        sendResponse({
            logo16: chrome.extension.getURL('fbtrex16.png'),
            logo48: chrome.extension.getURL('fbtrex48.png'),
            logo128: chrome.extension.getURL('fbtrex128.png')
        });
    }
});
