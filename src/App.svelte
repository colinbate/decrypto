<script>
	import {onMount} from 'svelte';
	import QuoteEntry from './QuoteEntry.svelte';
	import Solver from './Solver.svelte';
	import Parser from './parser.js';
	import {save, load} from './storage.js';
	let words = [];
	let knowns = [];
	const PARSED = 'PARSED';
	function startSolving(ev) {
		const { quote, knownEnc, knownPlain } = ev.detail;
		const enc = (knownEnc || '').toUpperCase();
		const plain = (knownPlain || '').toUpperCase();
		let flags;
		if (enc && plain) {
			flags = {[enc]: 'given'};
			knowns = [[enc, plain]];
		}
		const parsed = (new Parser(quote)).tokenize(flags);
		save(PARSED, parsed);
		words = parsed;
	}

	function startOver() {
		save(PARSED, null);
		knowns = [];
		words = [];
	}

	onMount(() => {
		console.log(`Mounting whole app, check for stored data`);
		const loaded = load(PARSED);
		if (loaded) {
			words = loaded;
		}
	});
</script>

<style>
	.content {
		margin: 0 auto;
		max-width: 60rem;
	}
</style>

<div class="content">
	<header><h1>DeCrypto</h1></header>
	<main>
		{#if words.length === 0}
			<QuoteEntry on:start={startSolving}/>
		{:else}
			<Solver words={words} knowns={knowns} on:reset={startOver}/>
		{/if}
	</main>
</div>
