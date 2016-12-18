import React from 'react';
import ReactDOM from 'react-dom';

import db from '../db';
import InfoBox from './components/infoBox';

function main () {
    chrome.cookies.get({
        url: 'https://www.facebook.com/',
        name: 'c_user'
    }, cookie => {
        const userId = cookie.value;
        db.get(userId).then(val =>
            ReactDOM.render(
                <InfoBox
                    userId={userId}
                    publicKey={val.publicKey} />,
                document.getElementById('main'))
        );
    });
}

main();
