import { dom } from "src/content_scripts";
import config from "src/background/config";
import scraper from "./scraper";

function observeTimeline(hub) {
  let watcher;

  hub.on("startScraping", (_, selectors) => {
    if (watcher) {
      return;
    }
    watcher = dom.on(selectors.timeline, element =>
      hub.send("newTimeline", {
        location: window.location.href,
        element
      })
    );
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
  let watcher;

  hub.on("startScraping", (_, selectors) => {
    if (watcher) {
      return;
    }
    watcher = dom.on(selectors.post, element =>
      hub.send("newPost", {
        data: scraper(element),
        element
      })
    );
    console.log("Start", selectors.post);
  });

  hub.on("stopScraping", (_, selectors) => {
    if (watcher) {
      watcher.disconnect();
      watcher = null;
      console.log("Stop", selectors.post);
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
