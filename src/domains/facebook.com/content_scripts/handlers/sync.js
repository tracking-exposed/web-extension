function handlePost(port, type, e) {
  port.postMessage({
    type: "impression",
    //impressionOrder: state.position++,
    //timelineId: state.timeline.id
    ...e.data,
    ...(e.data.visibility === "public" ? { html: e.element.outerHTML } : {})
  });
}

function handleTimeline(port, type, e) {
  port.postMessage({
    type: "timeline",
    //id: e.uuid,
    //startTime: e.startTime,
    location: window.location.href
  });
}

function handleAnomaly(port, type, e) {
  var report = {
    impressionCounter: state.position,
    timelineId: state.timeline.id,
    type: "anomaly",
    current: Object.assign(e.stats),
    previous: Object.assign(e.previous)
  };
  state.events.push(report);
}

export default function register(hub) {
  const port = browser.runtime.connect();
  hub.on("anomaly", handleAnomaly.bind(null, port));
  hub.on("newPost", handlePost.bind(null, port));
  hub.on("newTimeline", handleTimeline.bind(null, port));
}
