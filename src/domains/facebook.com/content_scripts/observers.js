import { dom } from "src/content_scripts";
import config from "src/background/config";
import { scrapePost, scrapeAbove, scrapeGrab } from "./scraper";

function observeTimeline(hub) {
  let watcher;

  hub.on("startScraping", (_, selectors) => {
    if (watcher) {
      return;
    }
    watcher = dom.on(selectors.timeline, element => {
      const location = window.location.href;
      const pathname = window.location.pathname;
      if (!pathname.match(selectors.pathname)) {
        console.debug("Location consideredn't by fbtrex", pathname);
        return;
      }

      hub.send("newTimeline", {
        location,
        element
      });
    });
    console.log("Start", selectors.timeline);
  });

  hub.on("stopScraping", (_, selectors) => {
    if (watcher) {
      watcher.disconnect();
      watcher = null;
      console.log("Stop", selectors.timeline);
    }
  });
}

function observePosts(hub) {
  /* standard watcher looks for public posts, the 'sad' is special advertising,
   * it looks for sponsored post which are custom audience (aka dark ads) and */
  let watcherStd = null, watcherSad = null, watcherEvent = null;

  hub.on("startScraping", (_, selectors) => {
    if (watcherStd) {
      return;
    }
    watcherStd = dom.on(selectors.post, element => {
      /* we've to check path now because the watcher is even based */
      const pathname = window.location.pathname;
      if (!pathname.match(selectors.pathname)) {
        return;
      }

      hub.send("newPost", {
        data: scrapePost(element),
        element
      });
    });

    watcherSad = dom.on(selectors.darkadv, element => {
      const pathname = window.location.pathname;
      if (!pathname.match(selectors.pathname)) {
        return;
      }

      hub.send("newDarkAdv", {
        data: scrapeAbove(element),
        element
      });
    });

    watcherEvent = dom.on(selectors.eventPage, element => {
      const pathname = window.location.pathname;
      if (!pathname.match(/\/events/))
        return;

      hub.send("newEventPage", {
        data: scrapeGrab(element),
        element
      })
    });

    console.log("Start watching on",
      selectors.post, selectors.darkadv, selectors.eventPage);
  });

  hub.on("stopScraping", (_, selectors) => {
    if (watcherStd) {
      watcherStd.disconnect();
      watcherStd = null;
      console.log("Stop", selectors.post);
    }
    if (watcherSad) {
      watcherSad.disconnect();
      watcherSad = null;
      console.log("Stop", selectors.darkadv);
    }
    if(watcherEvent) {
      /* events might need a dedicated switch */
      watcherEvent.disconnect();
      watcherEvent = null;
      console.log("Stop event full page watchers");
    }
  });
}

function observeLoginForm(hub) {
  const watcher = dom.one("form[action*=login]", form => {
    const email = form.querySelectorAll("input[name=email]")[0];
    const password = form.querySelectorAll("input[type=password]")[0];
    email.value = config.autologinEmail;
    password.value = config.autologinPassword;
    setTimeout(() => form.submit(), 1000);
  });
}

/* this is never used, TODO find out when it should? */
function observeWindowUnload(hub) {
  window.addEventListener("beforeunload", e => {
    hub.event("windowUnload");
  });
}

export default function start(hub) {
  observeTimeline(hub);
  observePosts(hub);

  if (config.autologinEmail && config.autologinPassword) {
    observeLoginForm(hub);
  }
}
