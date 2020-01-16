function eventHandler(type, e) {
  console.debug("[log event]", type, e);
}

export default function register(hub) {
  hub.on("*", eventHandler);
}
