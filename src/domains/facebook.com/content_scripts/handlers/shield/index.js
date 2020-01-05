// # Shield
//
// This handler protec but it also attac

import Component from "./Component.svelte";

function eventHandler(type, payload) {
  new Component({
    target: payload.element,
    anchor: payload.element.querySelector("div")
  });
}

export default function register(hub) {
  hub.on("newPost", eventHandler);
}
