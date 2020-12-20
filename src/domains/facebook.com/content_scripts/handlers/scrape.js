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
  return different;
}

function handleSetConfig(_, e, hub) {
  /* problem:
   * once Facebook switched to the new UX, I didn't have time to 
   * think how to support either the new or the old. It is not 
   * technically difficult; would be enought to spot we are collecting 
   * zero timeline or zero post, and switch to the second timeline/post detector */
  const selectors = {
    pathname: e.scrapeOutsideRoot ? /.*/ : /^(\/$|\/watch|\/events)/,
    timeline: "div[role='main']" + NOT_SCRAPED_SELECTOR,

    post: e.selector + NOT_SCRAPED_SELECTOR,

    /* this selector do not match the entire element, but we should look a few 
       .parentNode above; PLEASE NOTE, the NOT_SCRAPED_SELECTOR isn't here, but in
       the parentNode chain. */
    darkadv: "div[aria-label] > span[aria-labelledby]",

    /* this special 'eventPage' consider a dedicated pathname in the scraper, 
     * do not use the pathname above, but every /event */
    eventPage: "[data-pagelet='page']" + NOT_SCRAPED_SELECTOR,
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
  /* this receive all the events, because all should be marked.
     this only work to mark event. It do not mark thing incomplete */
  if(!e.element || !e.data) {
    console.warn("(dropping!) This should happens, for example, with location: ", e);
    return;
  }
  if(!e.element.outerHTML && e.element.length) {
    console.debug("List of elements marked / type", _, e.element.length);
    e.element.array.forEach(element => {
      element.classList.add("webtrex--scraped");
    });
  } else {
    console.debug("single element marked / type", _);
    e.element.classList.add("webtrex--scraped");
  }
}

function doNotMark(_, e) {
  /* do not mark because this is marked as a POST, not as darkad */
  console.debug("this special advertising is class-marked by scraper.js and not by scrape.js");
}

export default function register(hub) {
  hub.on("newTimeline", handleElement);
  hub.on("newPost", handleElement);
  hub.on("newDarkAdv", doNotMark);
  hub.on("setConfig", handleSetConfig);
}