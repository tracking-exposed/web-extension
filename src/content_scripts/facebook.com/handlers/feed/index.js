// # Feed
//
// This handler displays metadata about the scraping in the Facebook UI.

import { logger } from "../../../";
import Component from "./Component.svelte";

const log = logger("feed");

function eventHandler(type, payload) {
  new Component({
    target: payload.element,
    anchor: payload.element.querySelector("div"),
    props: payload.data
  });
}

export default function register(hub) {
  hub.register("newPost", eventHandler);
}
