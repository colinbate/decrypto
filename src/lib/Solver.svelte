<script lang="ts">
	import { findDuplicates } from './find-dupes.js';
	import { createPattern } from './pattern.js';
	import { saveMap, loadMap } from './storage.js';
	import type { Letter } from './types.js';
	import type { FormEventHandler } from 'svelte/elements';
	import { SvelteMap } from 'svelte/reactivity';
	import Button from './ui/button.svelte';
	import Icon from './ui/icon.svelte';
	type Props = {
		words: Letter[][];
		knowns: [string, string][];
		fromUrl: boolean;
		onreset: () => void;
		onerror: (m: string) => void;
		onnote: (m: string) => void;
	};
	let { words, knowns, fromUrl, onerror, onnote, onreset }: Props = $props();
	const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
	let knownMap: Map<string, string> | undefined;
	let selected = $state('');
	let selectedWord: Letter[] | undefined = $state();
	let timer: number | undefined;
	let showHelp = $state(false);
	let showCopy = $state(false);
	const key: Map<string, string> = new SvelteMap();
	let dupes = $derived(findDuplicates(key));
	let guessed = $derived(new Set(key.values()));

	const KEYS = 'KEYS';
	const KNOWN = 'KNOWN';
	$effect(() => {
		showCopy = !!window.navigator.clipboard;
		if (fromUrl) {
			clear(false);
			saveMap(KNOWN, null);
		}
		const keys = getMap(KEYS);
		knownMap = getMap(KNOWN) ?? new Map();
		if (keys) {
			copyMap(keys, key);
		} else if (knowns.length) {
			knownMap = new Map();
			knowns.forEach((known) => {
				key.set(known[0], known[1]);
				knownMap?.set(known[0], known[1]);
			});
			saveMap(KEYS, key);
			saveMap(KNOWN, knownMap);
		}
	});

	function copyMap(from: Map<string, string>, to: Map<string, string>) {
		from.entries().forEach((en) => to.set(en[0], en[1]));
	}

	function getMap(k: string): Map<string, string> | undefined {
		const entities = loadMap(k);
		return entities ? new SvelteMap(entities) : undefined;
	}

	let letterIndex = -1;
	function letterId() {
		letterIndex += 1;
		return `l-${letterIndex}`;
	}

	function getNextField(current: HTMLInputElement, dir: number) {
		const total = letterIndex + 1;
		const id = current.id;
		const [, numid] = id.split('-');
		const next = (parseInt(numid, 10) + dir + total) % total;
		const nextid = 'l-' + next;
		const nextField = current.form?.elements.namedItem(nextid) as HTMLInputElement | undefined;
		return nextField;
	}

	function gotoNextField(current: HTMLInputElement, dir = 1, empty = false) {
		let nextField = getNextField(current, dir);
		while (nextField !== current && empty && nextField?.value) {
			nextField = getNextField(nextField, dir);
		}
		if (nextField && nextField !== current) {
			nextField.focus();
			nextField.select();
		}
	}

	function handleArrows(ev: KeyboardEvent) {
		if (document.activeElement && document.activeElement.tagName === 'INPUT') {
			switch (ev.key) {
				case 'Left': // IE/Edge specific value
				case 'ArrowLeft':
					gotoNextField(document.activeElement as HTMLInputElement, -1);
					ev.preventDefault();
					break;
				case 'Right': // IE/Edge specific value
				case 'ArrowRight':
					gotoNextField(document.activeElement as HTMLInputElement, 1);
					ev.preventDefault();
					break;
				default:
					return;
			}
		}
	}

	function enterGuess(enc: string) {
		const handler: FormEventHandler<HTMLInputElement> = (ev) => {
			const target = ev.currentTarget;
			let plain = target.value.toUpperCase();
			if (plain.length > 1) {
				const prev = key.get(enc) || '';
				let newchar = plain.replace(prev, '');
				if (newchar.length > 1 || newchar === prev) {
					newchar = prev;
				}
				plain = newchar.toUpperCase();
			}
			if ((key.get(enc) || '') === plain) {
				target.value = plain;
				gotoNextField(target, 1, true);
				return;
			}
			if (plain) {
				key.set(enc, plain);
				saveMap(KEYS, key);
				gotoNextField(target, 1, true);
			} else {
				key.delete(enc);
				saveMap(KEYS, key);
			}
		};
		return handler;
	}

	function clear(onlyEntered: boolean) {
		key.clear();
		if (onlyEntered && knownMap) {
			copyMap(knownMap, key);
		}
		saveMap(KEYS, !onlyEntered ? null : key);
	}

	function reset() {
		clear(false);
		knownMap = new Map();
		saveMap(KNOWN, null);
		onreset();
	}

	function select(enc: string, word: Letter[]) {
		return () => {
			selected = enc;
			if (timer) {
				clearTimeout(timer);
			}
			selectedWord = word;
		};
	}

	function deselect() {
		selected = '';
		if (timer) {
			clearTimeout(timer);
		}
		timer = setTimeout(function () {
			selectedWord = undefined;
		}, 100);
	}

	function getHelp(word: Letter[]) {
		return () => {
			const pattern = createPattern(word, key);
			if (pattern == null) {
				onerror('Word needs at least one letter defined to search.');
			} else {
				showHelp = true;
				setTimeout(function () {
					const win = window.open(`https://xw.bate.dev/#advanced!$${pattern}`, 'xwhelp');
				}, 10);
			}
		};
	}

	function stopHelp() {
		showHelp = false;
	}

	function copy() {
		const all = [];
		for (const word of words) {
			for (const letter of word) {
				if (letter.punctuation) {
					all.push(letter.char);
				} else {
					all.push(key.get(letter.char) || '_');
				}
			}
			all.push(' ');
		}
		const final = all.join('').trim();
		window.navigator.clipboard.writeText(final);
		onnote('Copied');
	}
</script>

<svelte:window on:keydown={handleArrows} />
<form class="flex flex-col gap-4">
	<div class="flex flex-col md:flex-row">
		<div class="cf">
			{#each words as word}
				<div class="cf group relative float-left mb-0 mr-4" aria-selected={word === selectedWord}>
					{#each word as letter}
						<div class="float-left mb-4 mr-1 text-center">
							{#if letter.punctuation}
								<div class="relative top-[0.35rem]">{letter.char}</div>
							{:else}
								<label>
									<input
										type="text"
										value={key.get(letter.char) || ''}
										oninput={enterGuess(letter.char)}
										onfocus={select(letter.char, word)}
										onblur={deselect}
										data-highlight={letter.char === selected}
										data-dupe={dupes.has(letter.char)}
										disabled={!!letter.given}
										id={letterId()}
										class="mb-1 w-6 rounded border-0 bg-gray-200 p-[0.2rem] text-center ring-offset-0 focus:border-0 focus-visible:ring-1 focus-visible:ring-svelte disabled:bg-transparent disabled:text-emerald-500 data-[dupe=true]:bg-red-200 data-[highlight=true]:bg-blue-200 dark:bg-black dark:disabled:bg-transparent dark:disabled:text-emerald-300 dark:data-[dupe=true]:bg-red-800 dark:data-[highlight=true]:bg-blue-800"
									/>
									<span class="block">{letter.char}</span>
								</label>
							{/if}
						</div>
					{/each}
					<Button
						type="button"
						onclick={getHelp(word)}
						class="absolute -right-3 -top-3 z-10 hidden size-6 rounded-full p-1 group-aria-selected:flex"
						>?</Button
					>
				</div>
			{/each}
		</div>
		{#if showHelp}
			<div class="relative mx-auto w-min">
				<Button
					variant="ghost"
					onclick={stopHelp}
					class="absolute -right-3 -top-3 size-6 rounded-full bg-svelte p-0 text-white"
					><Icon icon="xmark" /></Button
				>
				<iframe
					class="rounded-lg border bg-gray-100 shadow-xl dark:border-gray-900"
					name="xwhelp"
					title="Help Tool"
					width="300"
					height="400"
					src="about:blank"
				></iframe>
			</div>
		{/if}
	</div>
	<div class="flex flex-wrap justify-between border-t pt-4">
		{#each ALPHABET as rem}
			<span class={guessed.has(rem) ? `text-gray-300 line-through dark:text-gray-500` : ''}
				>{rem}</span
			>
		{/each}
	</div>
	<div class="reset flex flex-wrap items-center gap-3 border-t pt-4">
		<Button onclick={() => clear(true)}>Clear Guesses</Button>
		<Button onclick={reset}>Try Different Quote</Button>
		{#if showCopy}<Button onclick={copy}>Copy to Clipboard</Button>{/if}
	</div>
</form>
