export type Flags = 'given' | 'punctuation';
type BaseLetter = { char: string };

export type Letter = BaseLetter & Partial<Record<Flags, boolean>>;
