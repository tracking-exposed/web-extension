// # Feed
//
// This handler displays metadata about the scraping in the Facebook UI.

import Component from "./Component.svelte";

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
