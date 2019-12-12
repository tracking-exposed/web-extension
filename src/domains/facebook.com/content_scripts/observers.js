import { logger, dom } from "src/content_scripts";
import config from "src/background/config";
import scraper from "./scraper";

const log = logger("observers");

function observeTimeline(hub) {
  let watcher;

  hub.on("startScraping", () => {
    if (watcher) {
      return;
    }
    watcher = dom.on("#newsFeedHeading", _ =>
      hub.send("newTimeline", {
        location: window.location.href
      })
    );
  });

  hub.on("stopScraping", () => {
    if (watcher) {
      watcher.disconnect();
    }
  });
}

function observePosts(hub) {
  let watcher;

  hub.on("startScraping", () => {
    if (watcher) {
      return;
    }
    watcher = dom.on(".userContentWrapper", element =>
      hub.send("newPost", {
        data: scraper(element),
        element
      })
    );
  });

  hub.on("stopScraping", () => {
    if (watcher) {
      watcher.disconnect();
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

function observeCookie(hub) {}

export default function start(hub) {
  log("Start DOM observers");

  observeTimeline(hub);
  observePosts(hub);

  if (config.autologinEmail && config.autologinPassword) {
    observeLoginForm(hub);
  }
}
