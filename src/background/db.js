const local = browser.storage.local;

export async function get(key, fallback) {
  const value = await local.get(key);

}

export async function set(key, valueOrFunc) {
}

export async function remove(key) {
}
