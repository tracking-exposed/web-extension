import { logger, dom } from "..";
import { getTimeISO8601, uuid } from "./utils";
import config from "../../config";

const log = logger("observers");
log(config);

// TODO: in order to extract the visibility of a post,
// we analyze the last word in the "aria-label" of the post itself.
// This part should be improved because there might be some really
// weird corner cases, for example if someone's first name is one
// of the `publicWords`, then we might detect a wrong visibility.
// See https://github.com/tracking-exposed/web-extension/issues/42
var publicWords = [
  "public", // Français, Română, English,
  "öffentlich", // Deutsch
  "offentlig", // Norsk (bokmål)
  "verejné", // Slovenčina
  "público", // Espanol
  "tutti", // Italiano
  "público", // Português
  "openbaar", // 'Nederlands',
  "iedereen", // 'Nederlands (België)',
  "avalik", // Eesti
  "publiczne", // Polish
  "opið" // Icelandic
];

export function scrape(element) {
  let sharingLevel;
  const sharingLevelElement = element.querySelector(
    '[data-hover="tooltip"][role][aria-label][data-tooltip-content]'
  );

  if (sharingLevelElement) {
    sharingLevel = sharingLevelElement
      .getAttribute("aria-label")
      .trim()
      .split(" ")
      .pop()
      .toLowerCase();
  }

  const visibility = publicWords.includes(sharingLevel) ? "public" : "private";

  return {
    visibility: visibility,
    visibilityInfo: sharingLevel,
    impressionTime: getTimeISO8601()
  };
}

export default function start(hub) {
  log("Start DOM observers");

  dom.on(".userContentWrapper", element =>
    hub.send("newPost", {
      data: scrape(element),
      element
    })
  );

  dom.on("#newsFeedHeading", _ =>
    hub.send("newTimeline", {
      uuid: uuid(),
      startTime: getTimeISO8601()
    })
  );

  if (config.autologinEmail && config.autologinPassword) {
    dom.one("form[action*=login]", form => {
      const email = form.querySelectorAll("input[name=email]")[0];
      const password = form.querySelectorAll("input[type=password]")[0];
      email.value = config.autologinEmail;
      password.value = config.autologinPassword;
      setTimeout(() => form.submit(), 1000);
    });
  }

  async function mmm() {
    const response = await browser.runtime.sendMessage({ greeting: "hello" });
    log(response);
  }

  mmm();
}
