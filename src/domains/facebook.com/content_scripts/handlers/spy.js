import logger from "src/common/logger";

const log = logger("spy");

function eventHandler(type, e) {
  log.debug("New event", type, e);
}

export default function register(hub) {
  hub.on("*", eventHandler);
}
