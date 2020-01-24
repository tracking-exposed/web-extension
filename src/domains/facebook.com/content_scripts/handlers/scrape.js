const NOT_SCRAPED_SELECTOR = ":not(.webtrex--scraped)";
const CHECK_VALUES = ["pathname", "timeline", "post"];
let lastValues = {};

function shouldRestart(newValues) {
  let different = false;
  for (let value of CHECK_VALUES) {
    if (lastValues[value] !== newValues[value]) {
      different = true;
    }
    lastValues[value] = newValues[value];
  }
  console.log("shouldRestart", newValues, lastValues, different);
  return different;
}

function handleSetConfig(_, e, hub) {
  const selectors = {
    pathname: e.scrapeOutsideRoot ? /.*/ : /^\/$/,
    timeline: "#newsFeedHeading" + NOT_SCRAPED_SELECTOR,
    post: e.selector + NOT_SCRAPED_SELECTOR
  };

  if (e.optIn && !e.pauseScraping) {
    if (shouldRestart(selectors)) {
      hub.send("stopScraping", selectors);
      hub.send("startScraping", selectors);
    } else {
      hub.send("startScraping", selectors);
    }
  }

  if (e.pauseScraping) {
    hub.send("stopScraping", selectors);
  }
}

function handleElement(_, e) {
  e.element.classList.add("webtrex--scraped");
}

export default function register(hub) {
  hub.on("newTimeline", handleElement);
  hub.on("newPost", handleElement);
  hub.on("setConfig", handleSetConfig);
}
