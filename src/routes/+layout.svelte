<script>
	import '../app.scss';
	import 'iconify-icon/dist/iconify-icon.js';

	let { children } = $props();
</script>

<main>
	{@render children?.()}
</main>

<style lang="scss">
	main {
		padding: 2rem;

		> :global(h1:first-of-type) {
			margin-bottom: 2rem;
		}
	}
</style>
