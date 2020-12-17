import { scrapePost, scrapeAbove, scrapeGrab } from "./scraper";
const INTERVAL = 5000;

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
    }, INTERVAL);
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
          // console.log("(post) Offset check", p.offsetTop);
          hub.send("newPost", {
            data: scrapePost(p),
            element: p
          });
        });
      }

      if(potentialdadv && potentialdadv.length) {
        console.log("potential DAV, cache nor class implemented!", potentialdadv.length);
          // TODO cache check and filtering
        potentialdadv.forEach(function(pdadv) {
          const data = scrapeAbove(pdadv);
          hub.send("newDarkAdv", {
            data,
            element: data.element
          });
        });
      }
    }, INTERVAL);

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
