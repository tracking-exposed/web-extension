import { logger } from "src/content_scripts";
import { getTimeISO8601 } from "./utils";

const log = logger("scraper");

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

export default function scrape(element) {
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
