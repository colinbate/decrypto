<script>
	import QuoteEntry from './QuoteEntry.svelte';
	import Solver from './Solver.svelte';
	import Parser from './parser.js';
	let words = [];
	let knowns = [];
	function startSolving(ev) {
		const { quote, knownEnc, knownPlain } = ev.detail;
		const enc = (knownEnc || '').toUpperCase();
		const plain = (knownPlain || '').toUpperCase();
		let flags;
		if (enc && plain) {
			flags = {[enc]: 'given'};
			knowns = [[enc, plain]];
		}
		words = (new Parser(quote)).tokenize(flags);
	}

	function startOver() {
		words = [];
	}
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
