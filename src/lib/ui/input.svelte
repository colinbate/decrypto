<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';
	import { cn } from '$lib/util.js';

	let { value = $bindable(), class: className, ...restProps }: HTMLInputAttributes = $props();
</script>

<input
	class={cn(
		'flex rounded-md border border-gray-400 bg-gray-100 px-3 py-2 text-base placeholder:text-gray-500 focus:ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-svelte focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-500 dark:bg-gray-900 dark:focus:ring-offset-gray-800',
		'h-10 file:border-0 file:bg-transparent file:text-sm file:font-medium',
		className
	)}
	bind:value
	{...restProps}
/>
