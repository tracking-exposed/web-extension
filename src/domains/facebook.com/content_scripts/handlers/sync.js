import { uuid, getTimeISO8601 } from "src/common/utils";

const INTERVAL = 1000;
const MAX_BUFFER_SIZE = 1024 * 1024;

var state = {
  timeline: null,
  position: 1,
  size: 0,
  events: []
};

function handlePost(type, e) {
  if(!e.data) {
    console.log(e, "has not visibility: skipping entry (type", type, ")");
    return;
  } else {
    console.debug("handlePost", e);
  }

  const impression = {
    type: "impression",
    visibility: e.data.visibility,
    visibilityInfo: e.data.visibilityInfo,
    startTime: getTimeISO8601(),
    impressionOrder: state.position++,
    timelineId: state.timelineId,
    from: e.data.from,
    kind: e.data.type,
  };

  if (impression.visibility === "public") {
    impression.html = e.element.outerHTML;
  }

  state.size += impression.html ? impression.html.length : 0;
  state.events.push(impression);
  if (state.size > MAX_BUFFER_SIZE) {
    console.debug(`Collected about ${state.size} bytes of data, forcing sync`);
    sync();
  }
}

function handleTimeline(type, e) {
  const id = uuid();
  state.position = 1;
  state.timelineId = id;
  state.events.push({
    id,
    type: "timeline",
    startTime: getTimeISO8601(),
    location: window.location.href
  });
}

function sync() {
  if (state.events.length) {
    console.log(`Sending ${state.events.length} events`);
    browser.runtime.sendMessage({
      method: "syncEvents",
      params: [state.events]
    });
    state.events = [];
  }
}
export default function register(hub) {
  hub.on("newPost", handlePost);
  hub.on("newDarkAdv", handlePost);
  hub.on("newTimeline", handleTimeline);
  window.setInterval(sync.bind(null, hub), INTERVAL);
}
