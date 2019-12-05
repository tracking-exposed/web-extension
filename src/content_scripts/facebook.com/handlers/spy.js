import { logger } from "../../";

const log = logger("spy");

function eventHandler(type, e) {
  log(type, e);
}

export default function register(hub) {
  hub.register("*", eventHandler);
}
