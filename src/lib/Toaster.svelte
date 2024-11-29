<script lang="ts">
	import { scale } from 'svelte/transition';
	import { tv } from 'tailwind-variants';
	import { cn } from './util';

	const DEFAULT_DURATION = 5000;
	const toastVariants = tv({
		base: `max-w-lg rounded-lg px-4 py-2`,
		variants: {
			type: {
				note: `bg-blue-100 text-blue-800`,
				error: `bg-red-100 text-red-800`
			}
		}
	});

	type Props = {
		msg: string;
		type: keyof typeof toastVariants.variants.type;
		onclose: () => void;
	};

	let { msg, type, onclose }: Props = $props();
	let timer: number | undefined;

	$effect(() => {
		if (msg.length) {
			timer = setTimeout(() => {
				onclose();
			}, DEFAULT_DURATION);
		}
		return () => {
			if (timer) {
				clearTimeout(timer);
			}
		};
	});
</script>

<div class="fixed left-0 top-4 flex w-full flex-col items-center">
	{#if msg.length}
		<div class={cn(toastVariants({ type }))} transition:scale={{ duration: 600 }}>
			<p>{msg}</p>
		</div>
	{/if}
</div>
