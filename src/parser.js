
const LEX_LETTER = 0;
const LEX_SPACE = 1;
const LEX_PUNCTUATION = 2;
const LEX_WORDBEGIN = 3;
const LEX_WORDEND = 4;
const LEX_NONE = 8;
const LEX_END = 9;

function getFinalTokens () {
  let type;
  if (this.lastType === LEX_WORDEND || this.lastType === LEX_END || this.lastType === LEX_SPACE) {
    type = LEX_END;
  } else {
    type = LEX_WORDEND;
  }
  this.lastType = type;
  return [type, null];
}

function getTokenType (code) {
  if (this.lexpos === 0 && this.lastType === LEX_NONE) {
    return LEX_WORDBEGIN;
  }
  if (code === 32 || code === 10) {
    if (this.lastType === LEX_LETTER || this.lastType === LEX_PUNCTUATION) {
      return LEX_WORDEND;
    }
    return LEX_SPACE;
  }
  if (code >= 65 && code <= 90) {
    if (this.lastType === LEX_SPACE) {
      return LEX_WORDBEGIN;
    }
    return LEX_LETTER;
  }
  if (this.lastType === LEX_SPACE) {
    return LEX_WORDBEGIN;
  }
  return LEX_PUNCTUATION;
}

function lex () {
  let type;
  let char;
  let code;
  if (this.lexpos === this.cipher.length) {
    return getFinalTokens.call(this);
  }
  char = this.cipher[this.lexpos];
  code = char.charCodeAt(0);
  type = getTokenType.call(this, code);
  if (type !== LEX_WORDBEGIN && type !== LEX_WORDEND) {
    this.lexpos += 1;
  }
  this.lastType = type;
  return [type, char];
}

function getLetter(char, flagMap = {}) {
  const ret = {
    char
  };
  if (char in flagMap) {
    ret[flagMap[char]] = true;
  }
  return ret;
}

function getPunct(char) {
  return {
    char,
    punctuation: true
  };
}

export default class CryptoquoteParser {
  constructor (cipher) {
    this.cipher = cipher.toUpperCase().trim().replace('\r', '');
    this.lexpos = 0;
    this.lastType = LEX_NONE;
  }
  
  tokenize (flagMap) {
    const tokens = [];
    let word = [];
    let [type, char] = lex.call(this);
    while (type !== LEX_END) {
      switch (type) {
        case LEX_WORDBEGIN:
          word = [];
          break;
        case LEX_WORDEND:
          tokens.push(word);
          break;
        case LEX_LETTER:
          word.push(getLetter(char, flagMap));
          break;
        case LEX_PUNCTUATION:
          word.push(getPunct(char));
          break;
      }
      [type, char] = lex.call(this);
    }
    return tokens;
  }
}