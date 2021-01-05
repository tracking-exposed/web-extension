import { scrapePost } from "./scraper";

let vhub = null;
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

const TIMELINE_INTERVAL_ms = 1000;
let tmlnInterval = null;
let timelineMatcher = null;
let timelineCSSSelector = null;
function timelineWatcher() { // called periodically

  const timeline = document.querySelectorAll(timelineCSSSelector);
  if(!timeline || !timeline.length)
    return;

  const location = window.location.href;
  const pathname = window.location.pathname;
  if (!pathname.match(timelineMatcher)) {
    console.debug("Location is consideredn't by web-trex", pathname);
    return;
  }
  console.log("new newsfeed|timeline start now!");
  timeline[0].classList.add("webtrex--scraped");

  cache = {};
  vhub.send("newTimeline", {
    location,
    element: timeline
  });
}

function findTimeline(hub) {

  hub.on("startScraping", (_, selectors) => {
    if (tmlnInterval) {
      return;
    }
    timelineCSSSelector = selectors.timeline;
    timelineMatcher = selectors.pathname;
    vhub = hub;
    tmlnInterval = setInterval(timelineWatcher, TIMELINE_INTERVAL_ms);
  });
  hub.on("stopScraping", (_, selectors) => {
    if (tmlnInterval) {
      clearInterval(tmlnInterval);
      tmlnInterval = null;
    }
  });
}

const POST_INTERVAL_ms = 3000;
const POST_DELAY_ms = 500;
let postInterval = null;
let postCSSSelector = null;

function postWatcher() { // called periodically
  const normalposts = document.querySelectorAll(postCSSSelector);
  if(normalposts && normalposts.length) {
    const freshest = Array.from(normalposts).filter(sessionCache);
    // console.log("matching posts", normalposts.length, "surviving cache check", freshest.length);
    freshest.forEach(function(p) {
      window.setTimeout(() => {
        vhub.send("newPost", {
          data: scrapePost(p),
          element: p
        });
      }, POST_DELAY_ms);
    });
  }

  // after this check we look for dark advertising, this also 
  // would trigger all the advertising. By using the 'cache'
  // we avoid the appearence of duplicated package. When, if,
  // one of the collection break, we might notice on the backend
  // that only advertising OR only non-advertising is given
  const darkadv = document.querySelectorAll("div[aria-label] > a[aria-labelledby]");
  if(darkadv && darkadv.length) {
    Array.from(darkadv).forEach((dav) => {
      vhub.send("newDarkAdv", {
        e: recursiveParent(dav, 60000),
        data: { visibility: "public", from: 'darkadv' }
      });
    })
  }
}

function recursiveParent(node, MAX) {
  return (node.parentNode.outerHTML.length < MAX) ?
    recursiveParent(node.parentNode, MAX) : node;
}

function findPosts(hub) {

  hub.on("startScraping", (_, selectors) => {
    if (postInterval) {
      return;
    }
    vhub = hub;
    postCSSSelector = selectors.post;
    postInterval = setInterval(postWatcher, POST_INTERVAL_ms);
  });
  hub.on("stopScraping", (_, selectors) => {
    if (postInterval) {
      clearInterval(postInterval);
      postInterval = null;
    }
  });
}

function observeWindowUnload(hub) {
  window.addEventListener("beforeunload", e => {
    console.log("Trapped! …So what? Is this handled?");
    hub.send("windowUnload");
  });
}


export default function start(hub) {
  // these is an anti pattern in the find* functions, because:
  // 1) from the observers I switch on intervals
  // 2) from the intervals I want to invoke a function name
  // 3) so the variables (selectors and hub) become global in this file.
  findTimeline(hub);
  findPosts(hub);
  observeWindowUnload(hub);
}