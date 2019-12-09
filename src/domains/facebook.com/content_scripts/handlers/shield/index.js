// # Shield
//
// This handler protec but it also attac

import { logger } from "src/content_scripts";
import Component from "./Component.svelte";

const log = logger("shield");

function eventHandler(type, payload) {
  new Component({
    target: payload.element,
    anchor: payload.element.querySelector("div")
  });
}

export default function register(hub) {
  hub.on("newPost", eventHandler);
}
