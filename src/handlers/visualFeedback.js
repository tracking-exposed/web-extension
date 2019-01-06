import React from 'react';
import ReactDOMServer from 'react-dom/server';
import $ from 'jquery';

import config from '../config';
import selector from '../selector';

import VisualFeedback from '../components/visualFeedback';
import AnomalyReport from '../components/anomalyReport';

function eventHandler (type, e) {
    if(selector.stats.isWarning()) {
        e.element.prepend($(ReactDOMServer.renderToString(
            <AnomalyReport
                logo={config.logo16} />
        )));
    } else {
        e.element.prepend($(ReactDOMServer.renderToString(
            <VisualFeedback
                event={e}
                logo={config.logo16} />
        )));
    }
}

export function register (hub) {
    hub.register('newPost', eventHandler);
}
