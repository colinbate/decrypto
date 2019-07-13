export function findDuplicates (key) {
  const dupes = new Set();
  const rev = new Map();
  if (key) {
    for (let pair of key.entries()) {
      if (rev.has(pair[1])) {
        dupes.add(pair[0]);
        dupes.add(rev.get(pair[1]));
      } else {
        rev.set(pair[1], pair[0]);
      }
    }
  }
  return dupes;
}