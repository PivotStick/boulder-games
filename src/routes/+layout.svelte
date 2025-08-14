<script>
	import '../app.scss';
	import 'iconify-icon/dist/iconify-icon.js';

	import Snacks from '$lib/components/Snacks.svelte';

	let { children } = $props();
</script>

<Snacks />

<main>
	{@render children?.()}
</main>

<style lang="scss">
	main {
		padding: 2rem;
		display: grid;
		gap: 2rem;

		> :global(h1:first-of-type) {
			margin-bottom: 2rem;
		}
	}
</style>
