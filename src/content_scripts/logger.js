const ROOT = "trex";

export default function get(context) {
  context = context ? [ROOT, context].join(":") : ROOT;
  const _get = method =>
    Function.prototype.bind.call(console[method], console, context);
  const log = _get("log");
  log.debug = _get("debug");
  log.info = _get("info");
  log.warn = _get("warn");
  log.error = _get("error");
  return log;
}
