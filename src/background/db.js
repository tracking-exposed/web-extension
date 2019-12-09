const local = browser.storage.local;

function join(key) {
  return key instanceof Array ? key.join(":") : key;
}

async function get(key, fallback) {
  key = join(key);
  const value = await local.get(key);
  return value === undefined || value === null ? fallback : value[key];
}

async function set(key, value) {
  key = join(key);
  console.log("set key", key, value);
  return local.set({ key: value });
}

async function remove(key) {}

export default {
  join,
  get,
  set,
  remove
};
