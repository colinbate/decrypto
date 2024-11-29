export function save(key: string, value: unknown) {
	if (value === undefined) {
		value = null;
	}
	localStorage.setItem(key, JSON.stringify(value));
}

export function load(key: string) {
	const stored = localStorage.getItem(key) || 'null';
	return JSON.parse(stored);
}

export function saveMap(key: string, map: Map<string, string> | null) {
	if (map) {
		save(key, Array.from(map.entries()));
	} else {
		save(key, map);
	}
}

export function loadMap(key: string): [string, string][] | undefined {
	return load(key);
}
