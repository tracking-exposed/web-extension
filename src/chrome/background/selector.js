import api from '../api';
const bo = chrome || browser;
import selector from '../../selector';
import config from '../../config';

console.log("Addinf listener selector");
bo.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log(request);
    console.log("ù----");
    console.log(sender);
    if(request.type === 'selectorFetch') {
        api
            .selectorGet(request.version, request.userId)
            .then(response => sendResponse({ type: 'selectorReceived', response: response }))
            .catch(error => sendResponse({ type: 'selectorError', response: error }))
        return true;
    }
});

