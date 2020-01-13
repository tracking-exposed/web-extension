const local = browser.storage.local;

function join(key) {
  return key instanceof Array ? key.join(":") : key;
}

async function get(key, fallback) {
  key = join(key);
  const value = (await local.get(key))[key];
  return value === undefined ? fallback : value;
}

async function set(key, valueOrFunc, fallback) {
  key = join(key);
  let newValue;
  if (valueOrFunc instanceof Function) {
    const previousValue = await get(key, fallback);
    newValue = valueOrFunc(previousValue);
  } else {
    newValue = valueOrFunc;
  }

  return local.set({ [key]: newValue });
}

async function update(key, value) {
  if (!(value instanceof Object)) {
    throw new Error("Value must be an object.");
  }
  key = join(key);
  const previousValue = await get(key, {});
  const newValue = { ...previousValue, ...value };
  return local.set({ [key]: newValue });
}

async function remove(key) {
  return local.remove(key);
}

export default {
  join,
  get,
  set,
  update,
  remove
};
