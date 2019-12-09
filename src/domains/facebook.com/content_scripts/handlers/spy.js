import { logger } from "src/content_scripts";

const log = logger("spy");

function eventHandler(type, e) {
  log(type, e);
}

export default function register(hub) {
  hub.on("*", eventHandler);
}
