<script lang="ts">
	import ModeSwitcher from './lib/ModeSwitcher.svelte';
	import QuoteEntry from './lib/QuoteEntry.svelte';
	import Solver from './lib/Solver.svelte';
	import Toaster from './lib/Toaster.svelte';
	import Parser from './lib/parser.js';
	import { save, load } from './lib/storage.js';
	import type { Flags, Letter } from './lib/types';
	let words: Letter[][] = $state([]);
	let knowns: [string, string][] = $state([]);
	let msg = $state('');
	let msgType: 'error' | 'note' = $state('error');
	let fromUrl = $state(false);
	const PARSED = 'PARSED';

	function startSolving(quote: string, knownEnc: string, knownPlain: string) {
		const enc = (knownEnc || '').toUpperCase();
		const plain = (knownPlain || '').toUpperCase();
		let flags: Record<string, Flags> = {};
		if (enc && plain) {
			flags = { [enc]: 'given' };
			knowns = [[enc, plain]];
		}
		const parsed = new Parser(quote).tokenize(flags);
		save(PARSED, parsed);
		words = parsed;
	}

	function startOver() {
		save(PARSED, null);
		knowns = [];
		words = [];
	}

	function showError(m: string) {
		msg = m;
		msgType = 'error';
	}

	function showNote(m: string) {
		msg = m;
		msgType = 'note';
	}
	function closeToast() {
		msg = '';
	}

	$effect(() => {
		console.log(`Mounting whole app, check for stored data`);
		let loaded = load(PARSED);
		const hash = window.location.hash;
		if (hash && hash.startsWith('#cypher=')) {
			const ct = decodeURIComponent(hash.replace(/^#cypher=/, '').replace(/\+/g, ' ')).trim();
			if (ct) {
				let proceed = true;
				if (loaded) {
					proceed = confirm(
						'You were already solving a quote, would you like to replace it with the one provided in the URL?'
					);
				}
				if (proceed) {
					loaded = new Parser(ct).tokenize();
					save(PARSED, loaded);
					fromUrl = true;
				}
			}
			window.location.hash = '';
		}
		if (loaded) {
			words = loaded;
		}
	});
</script>

<ModeSwitcher />
<div class="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-6">
	<header><h1 class="text-6xl font-thin text-svelte">DeCrypto</h1></header>
	<main>
		{#if words.length === 0}
			<QuoteEntry onstart={startSolving} />
		{:else}
			<Solver
				{words}
				{knowns}
				onreset={startOver}
				onerror={showError}
				onnote={showNote}
				{fromUrl}
			/>
		{/if}
	</main>
	<Toaster {msg} type={msgType} onclose={closeToast} />
</div>
