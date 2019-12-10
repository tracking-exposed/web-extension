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
  return local.set({ [key]: value });
}

async function update(key, value) {
  if (!(value instanceof Object)) {
    throw new Error("value must be an object");
  }
  key = join(key);
  const prev = await get(key, {});
  return local.set({ [key]: { ...prev, ...value } });
}

async function remove(key) {}

export default {
  join,
  get,
  set,
  update,
  remove
};
