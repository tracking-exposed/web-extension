import uuidv4 from "uuid/v4";

export const uuid = uuidv4;

export function getTimeISO8601(date) {
  // Thanks to http://stackoverflow.com/a/17415677/597097
  const now = date || new Date();
  const tzo = -now.getTimezoneOffset();
  const dif = tzo >= 0 ? "+" : "-";
  const pad = num => {
    const norm = Math.abs(Math.floor(num));
    return (norm < 10 ? "0" : "") + norm;
  };
  return [
    now.getFullYear(),
    "-",
    pad(now.getMonth() + 1),
    "-",
    pad(now.getDate()),
    "T",
    pad(now.getHours()),
    ":",
    pad(now.getMinutes()),
    ":",
    pad(now.getSeconds()),
    dif,
    pad(tzo / 60),
    ":",
    pad(tzo % 60)
  ].join("");
}

export function normalizeUrl(url) {
  if (!url) {
    url = null;
  } else if (url[0] === "/") {
    url = "https://www.facebook.com" + url;
  }
  return url;
}

export function isEmpty(object) {
  return (
    object === null || object === undefined || Object.keys(object).length === 0
  );
}

export function isFunction(value) {
  return value instanceof Function;
}

export function decodeString(s) {
  // Credits: https://github.com/dchest/tweetnacl-util-js
  var d = unescape(encodeURIComponent(s));
  var b = new Uint8Array(d.length);

  for (var i = 0; i < d.length; i++) {
    b[i] = d.charCodeAt(i);
  }
  return b;
}

export function decodeKey(key) {
  return new Uint8Array(bs58.decode(key));
}
