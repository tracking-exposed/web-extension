function eventHandler(type, e) {
  console.debug("New event", type, e);
}

export default function register(hub) {
  hub.on("*", eventHandler);
}
