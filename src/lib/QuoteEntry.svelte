<script lang="ts">
	import Button from './ui/button.svelte';
	import { getNewQuote } from './quotes.js';
	import Textarea from './ui/textarea.svelte';
	import Input from './ui/input.svelte';
	type Props = { onstart: (quote: string, knownEnc: string, knownPlain: string) => void };
	let { onstart }: Props = $props();
	let cypher = $state('');
	let knownEnc = $state('');
	let knownPlain = $state('');
	async function setNewQuote() {
		cypher = await getNewQuote();
	}
</script>

<form class="flex flex-col gap-4">
	<p class=" max-w-xl">
		A simple utility to help you solve letter substitution puzzles. Enter the cypher text below. You
		can click the '?' button after each word to search using my <a
			href="https://xw.bate.dev/#advanced">xw</a
		> tool.
	</p>
	<div class="flex flex-col gap-2">
		<div class="flex items-center justify-between">
			<label for="cyphertext" class="font-bold">Cypher Text</label>
			<Button size="sm" onclick={setNewQuote}>Load Random Quote</Button>
		</div>
		<Textarea bind:value={cypher} rows={6} id="cyphertext" class="w-full"></Textarea>
	</div>
	<div class="flex flex-col gap-2">
		<label for="origc" class="block"
			>Known Replacement <span class="text-gray-500">(optional)</span></label
		>
		<div class="flex items-center gap-2">
			<Input type="text" class="text-center" size={3} bind:value={knownEnc} id="origc" />
			stands for
			<Input type="text" class="text-center" size={3} bind:value={knownPlain} />
		</div>
	</div>
	<div>
		<Button disabled={cypher.length === 0} onclick={() => onstart(cypher, knownEnc, knownPlain)}
			>Start Solving</Button
		>
	</div>
</form>
