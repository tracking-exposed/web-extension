import { scrapePost, scrapeAbove } from "./scraper";
const TIMELINE_INTERVAL = 1000;
const POST_INTERVAL = 3000;
const POST_DELAY = 500;

let cache = {};
/* this function is call by a .filter */
function sessionCache(e) {
  const offset = e.offsetTop;
  const size = e.innerHTML.length;

  if(cache[offset]) {
    if(cache[offset] == size)
      return false;

    cache[offset] = size;
    return true;
  }
  cache[offset] = size;
  return true;
}

function findTimeline(hub) {
  let interval = null;

  hub.on("startScraping", (_, selectors) => {
    if (interval) {
      return;
    }
    // console.log("Start (timeline)", selectors.timeline);
    interval = setInterval(function() {
      const timeline = document.querySelectorAll(selectors.timeline);
      if(!timeline || !timeline.length)
        return;

      // console.log("timeline(s)?", timeline.length);
      const location = window.location.href;
      const pathname = window.location.pathname;
      if (!pathname.match(selectors.pathname)) {
        console.debug("Location is consideredn't by web-trex", pathname);
        return;
      }
      timeline[0].classList.add("webtrex--scraped");
      // console.log("New timeline, added class, cache reset");
      cache = {};
      hub.send("newTimeline", {
        location,
        element: timeline
      });

      /* this is not the right place to do it but until I don't
      get the tree of dependencies ... */
      if( window.location.pathname.match(selectors.pathname) &&
          window.location.pathname.match(/\/events\/(\d+)/)) {
        console.log("Event page spotted!, scrapedEvent", window.location.pathname);
        /* todo scrape a bit */
        hub.send("scrapedEvent", {
          data: {
            path: window.location.pathname,
            type: 'evelif',
          },
          element: timeline[0]
        })
        timeline[0].classList.add("webtrex--scraped");
      }
    }, TIMELINE_INTERVAL);
  });

  hub.on("stopScraping", (_, selectors) => {
    if (interval) {
      clearInterval(interval);
      interval = null;
      console.log("Stop scraping (timeline)", selectors.timeline);
    }
  });
}

function findPosts(hub) {
  let interval = null;

  hub.on("startScraping", (_, selectors) => {
    if (interval) {
      return;
    }

    interval = setInterval(function() {
      const normalposts = document.querySelectorAll(selectors.post);
      const potentialdadv = document.querySelectorAll(selectors.darkadv);

      if(normalposts && normalposts.length) {
        const freshest = Array.from(normalposts).filter(sessionCache);
        // console.log("matching posts", normalposts.length, "surviving cache check", freshest.length);
        freshest.forEach(function(p) {
          window.setTimeout(() => {
            hub.send("newPost", {
              data: scrapePost(p),
              element: p
            });
          }, POST_DELAY);
        });
      }

      if(potentialdadv && potentialdadv.length) {
        console.log("(look) dark advertising <no cache|no class>", potentialdadv.length);
        potentialdadv.forEach(function(pdadv) {
          const data = scrapeAbove(pdadv);
          hub.send("newDarkAdv", {
            data,
            element: data.element
          });
        });
      }

    }, POST_INTERVAL);

  });

  hub.on("stopScraping", (_, selectors) => {
    if (interval) {
      clearInterval(interval);
      interval = null;
      console.log("Stop (posts)", selectors.timeline);
    }
  });

}


/* this is never used, TODO find out when it should? */
function observeWindowUnload(hub) {
  window.addEventListener("beforeunload", e => {
    hub.event("windowUnload");
  });
}

export default function start(hub) {
  findTimeline(hub);
  findPosts(hub);
}