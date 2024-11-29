import type { Flags, Letter } from './types';

const LEX_LETTER = 0;
const LEX_SPACE = 1;
const LEX_PUNCTUATION = 2;
const LEX_WORDBEGIN = 3;
const LEX_WORDEND = 4;
const LEX_NONE = 8;
const LEX_END = 9;

export default class CryptoquoteParser {
	#cipher: string;
	#lexpos: number;
	#lastType: number;

	constructor(cipher: string) {
		this.#cipher = cipher.toUpperCase().trim().replace('\r', '');
		this.#lexpos = 0;
		this.#lastType = LEX_NONE;
	}

	#getFinalTokens(): [number, null] {
		const type =
			this.#lastType === LEX_WORDEND || this.#lastType === LEX_END || this.#lastType === LEX_SPACE
				? LEX_END
				: LEX_WORDEND;
		this.#lastType = type;
		return [type, null];
	}

	#getTokenType(code: number): number {
		if (this.#lexpos === 0 && this.#lastType === LEX_NONE) {
			return LEX_WORDBEGIN;
		}
		if (code === 32 || code === 10) {
			return this.#lastType === LEX_LETTER || this.#lastType === LEX_PUNCTUATION
				? LEX_WORDEND
				: LEX_SPACE;
		}
		if (code >= 65 && code <= 90) {
			return this.#lastType === LEX_SPACE ? LEX_WORDBEGIN : LEX_LETTER;
		}
		return this.#lastType === LEX_SPACE ? LEX_WORDBEGIN : LEX_PUNCTUATION;
	}

	#lex(): [number, string | null] {
		if (this.#lexpos === this.#cipher.length) {
			return this.#getFinalTokens();
		}
		const char = this.#cipher[this.#lexpos];
		const code = char.charCodeAt(0);
		const type = this.#getTokenType(code);
		if (type !== LEX_WORDBEGIN && type !== LEX_WORDEND) {
			this.#lexpos += 1;
		}
		this.#lastType = type;
		return [type, char];
	}

	#getLetter(char: string, flagMap: Record<string, Flags> = {}): Letter {
		const token: Letter = { char };
		if (flagMap[char]) {
			token[flagMap[char]] = true;
		}
		return token;
	}

	#getPunct(char: string): Letter {
		return {
			char,
			punctuation: true
		};
	}

	public tokenize(flagMap?: Record<string, Flags>): Letter[][] {
		const tokens: Letter[][] = [];
		let word: Letter[] = [];
		let [type, char] = this.#lex();

		while (type !== LEX_END) {
			switch (type) {
				case LEX_WORDBEGIN:
					word = [];
					break;
				case LEX_WORDEND:
					tokens.push(word);
					break;
				case LEX_LETTER:
					if (char) word.push(this.#getLetter(char, flagMap));
					break;
				case LEX_PUNCTUATION:
					if (char) word.push(this.#getPunct(char));
					break;
			}
			[type, char] = this.#lex();
		}

		return tokens;
	}
}
