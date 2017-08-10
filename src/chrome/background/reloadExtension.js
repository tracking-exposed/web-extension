const chrome = chrome || browser;

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === 'reloadExtension') {
        chrome.runtime.reload();
    }
});
