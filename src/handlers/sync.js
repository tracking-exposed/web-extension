import config from '../config';
const bo = chrome || browser;

const INTERVAL = config.FLUSH_INTERVAL;

var state = {
    timeline: null,
    position: 1,
    events: []
};

function handlePost (type, e) {
    var post = Object.assign({
        impressionOrder: state.position++,
        visibility: type,
        visibilityInfo: e.visibilityInfo, // unset from scrape.js
        type: 'impression',
        timelineId: state.timeline.id
    }, e.data);

    if (post.visibility === 'public') {
        post.html = e.element.html();
    }

    state.events.push(post);
}

function handleTimeline (type, e) {
    state.position = 1;
    state.timeline = {
        type: 'timeline',
        id: e.uuid,
        startTime: e.startTime,
        location: window.location.href
    };

    if (config.settings.isStudyGroup) {
        state.timeline.tagId = config.settings.tagId;
    }

    state.events.push(state.timeline);
}

function sync (hub) {
    if (state.events.length) {
        // Send timelines to the page handling the communication with the API.
        // This might be refactored using something compatible to the HUB architecture.
        bo.runtime.sendMessage({ type: 'sync', payload: state.events, userId: config.userId },
                                   (response) => hub.event('syncResponse', response));

        state.events = [];
    }
}

export function register (hub) {
    hub.register('newPost', handlePost);
    hub.register('newTimeline', handleTimeline);
    hub.register('windowUnload', sync.bind(null, hub));
    window.setInterval(sync.bind(null, hub), INTERVAL);
}
