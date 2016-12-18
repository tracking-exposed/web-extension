import React from 'react';
import ReactDOMServer from 'react-dom/server';
import $ from 'jquery';

import config from '../config';

import VisualFeedback from '../components/visualFeedback';

function eventHandler (type, e) {
    e.element.prepend($(ReactDOMServer.renderToString(
        <VisualFeedback
            event={e}
            logo={config.logo16} />
    )));
}

export function register (hub) {
    hub.register('newPost', eventHandler);
}
