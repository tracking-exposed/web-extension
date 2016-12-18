import React from 'react';
import ReactDOMServer from 'react-dom/server';
import $ from 'jquery';

import VisualDebugBox from '../components/visualDebugBox';

function eventHandler (type, e) {
    e.element.addClass('fbtrex--visibility-' + e.data.visibility);

    if (e.data.visibility === 'public') {
        e.element.prepend($(ReactDOMServer.renderToString(
            <VisualDebugBox event={e} />
        )));
    }
}

export function register (hub) {
    hub.register('newPost', eventHandler);
}
