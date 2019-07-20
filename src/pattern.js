
const ANY = '.';
export function createPattern(word, key) {
  const digitMap = new Map();
  const chars = word.filter(x => !x.punctuation);
  const pattern = new Array(chars.length);
  let nextDigit = 1;
  let valid = false;
  for (let i = 0; i < chars.length; i += 1) {
    const c = chars[i].char;
    if (key.has(c)) {
      pattern[i] = key.get(c).toLowerCase();
      valid = true;
    } else if (!digitMap.has(c)) {
      pattern[i] = ANY;
      digitMap.set(c, 0 - i);
    } else if (digitMap.get(c) > 0) {
      pattern[i] = digitMap.get(c).toString();
    } else {
      const prev = Math.abs(digitMap.get(c));
      pattern[prev] = nextDigit;
      pattern[i] = nextDigit;
      digitMap.set(c, nextDigit);
      nextDigit += 1;
    }
  }
  return valid ? pattern.join('') : null;
}