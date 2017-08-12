import db from '../db';
const bo = chrome || browser;


bo.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === 'chromeConfig') {
        bo.cookies.get({
            url: 'https://www.facebook.com/',
            name: 'c_user'
        }, cookie => {
            const userId = cookie ? cookie.value : "loggedOut";
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

                        logo16: bo.extension.getURL('fbtrex16.png'),
                        logo48: bo.extension.getURL('fbtrex48.png'),
                        logo128: bo.extension.getURL('fbtrex128.png')
                    });
                });
        });
        return true;
    }
});
