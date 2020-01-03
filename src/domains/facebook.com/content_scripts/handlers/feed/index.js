// # Feed
//
// This handler displays metadata about the scraping in the Facebook UI.

import { logger } from "src/content_scripts";
import Component from "./Component.svelte";

const log = logger("feed");

function eventHandler(type, payload, hub) {
  new Component({
    target: payload.element,
    anchor: payload.element.querySelector("div"),
    props: {
      hub,
      visibility: payload.data.visibility
    }
  });
}

export default function register(hub) {
  hub.on("newPost", eventHandler);
}
