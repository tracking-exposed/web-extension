import { uuid, getTimeISO8601 } from "src/common/utils";

const INTERVAL = 10000; // this interval should come from config
const MAX_BUFFER_SIZE = 1024 * 1024;

var state = {
  timeline: null,
  position: 1,
  size: 0,
  events: []
};

function handlePost(type, e) {
  if(!e.data) {
    if(e.element && !!e.element.querySelector) {
      console.log(
        "has not visibility? <type", type, ">",
        Array.from(e.element.querySelectorAll('h4').map('textContent'))
      );
    } else
      console.debug(type, "discarged", e.element, "has no parsed data");
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
    offsetTop: e.element.offsetTop,
    offsetBottom: e.element.offsetBottom,
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

function handleEvent(type, e) {
  const id = uuid();
  state.events.push({
    id,
    type: e.data.type,
    path: e.data.path,
    element: e.element.outerHTML,
    openingTime: getTimeISO8601()
  });
}

function sync() {
  if (state.events.length) {
    console.log(`Sending ${state.events.length}, ${state.events.map((e)=>{return e.type})} events`);
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
  hub.on("scrapedEvent", handleEvent);
  window.setInterval(sync.bind(null, hub), INTERVAL);
}