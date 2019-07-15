
export function save(key, value) {
  if (value === undefined) {
    value = null;
  }
  localStorage.setItem(key, JSON.stringify(value));
}

export function load(key) {
  const stored = localStorage.getItem(key) || 'null';
  return JSON.parse(stored);
}

export function saveMap(key, map) {
  if (map) {
    save(key, Array.from(map.entries()));
  } else {
    save(key, map);
  }
}

export function loadMap(key) {
  const entries = load(key);
  return entries ? new Map(entries) : entries;
}