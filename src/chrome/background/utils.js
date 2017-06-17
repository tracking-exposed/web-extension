import db from '../db';
const chrome = chrome || browser;


chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === 'chromeConfig') {
        chrome.cookies.get({
            url: 'https://www.facebook.com/',
            name: 'c_user'
        }, cookie => {
            const userId = cookie.value;
            db
                .get(userId + '/settings')
                .then(settings => {
                    sendResponse({
                        userId: userId,

                        // Expose only what we need
                        settings: settings ? {
                            lessInfo: settings.lessInfo,
                            tagId: settings.tagId,
                            isStudyGroup: settings.isStudyGroup
                        } : {
                            lessInfo: false,
                            tagId: null,
                            isStudyGroup: false
                        },

                        logo16: chrome.extension.getURL('fbtrex16.png'),
                        logo48: chrome.extension.getURL('fbtrex48.png'),
                        logo128: chrome.extension.getURL('fbtrex128.png')
                    });
                });
        });
        return true;
    }
});
