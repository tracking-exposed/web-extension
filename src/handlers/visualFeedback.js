import React from 'react';
import ReactDOMServer from 'react-dom/server';
import $ from 'jquery';

import VisualFeedback from '../components/visualFeedback';

function eventHandler (type, e) {
    // e.element.addClass('fbtrex--visibility-' + e.data.visibility);

    e.element.prepend($(ReactDOMServer.renderToString(
        <VisualFeedback event={e} />
    )));
}

export function register (hub) {
    hub.register('newPost', eventHandler);
}
