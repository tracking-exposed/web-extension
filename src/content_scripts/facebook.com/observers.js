import { logger, dom } from "..";
import { getTimeISO8601, uuid } from "./utils";
import config from "../../config";
import scraper from "./scraper";

const log = logger("observers");

function observeTimeline(hub) {
  dom.on("#newsFeedHeading", _ =>
    hub.send("newTimeline", {
      uuid: uuid(),
      startTime: getTimeISO8601()
    })
  );
}

function observePosts(hub) {
  dom.on(".userContentWrapper", element =>
    hub.send("newPost", {
      data: scraper(element),
      element
    })
  );
}

function observeLoginForm(hub) {
  dom.one("form[action*=login]", form => {
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
