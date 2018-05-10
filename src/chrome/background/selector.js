import api from '../api';
const bo = chrome || browser;
import selector from '../../selector';
import config from '../../config';

bo.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if(request.type === 'userInfo') {
        api
            .selector(request.payload, request.userId)
            .then(response => sendResponse({ type: 'selectorReceived', response: response }))
            .catch(error => sendResponse({ type: 'selectorError', response: error }))
        return true;
    }
});

