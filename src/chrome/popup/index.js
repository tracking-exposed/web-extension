import React from 'react';
import ReactDOM from 'react-dom';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import db from '../db';
import Popup from './components/popup';

const bo = chrome || browser;

function main () {
    bo.cookies.get({
        url: 'https://www.facebook.com/',
        name: 'c_user'
    }, cookie => {
        const userId = cookie.value;
        db.get(userId).then(val =>
            ReactDOM.render(
                <MuiThemeProvider>
                    <Popup
                        userId={userId}
                        publicKey={val.publicKey} />
                </MuiThemeProvider>,
                document.getElementById('main'))
        );
    });
}

main();
