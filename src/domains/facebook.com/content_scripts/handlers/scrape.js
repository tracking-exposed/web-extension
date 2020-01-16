const NOT_SCRAPED_SELECTOR = ":not(.webtrex--scraped)";

function handleSetConfig(_, e, hub) {
  const selectors = {
    timeline: "#newsFeedHeading" + NOT_SCRAPED_SELECTOR,
    post: e.selector + NOT_SCRAPED_SELECTOR
  };

  if (e.optIn && !e.pauseScraping) {
    hub.send("startScraping", selectors);
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
