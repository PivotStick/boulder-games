<script>
	import { action } from '$lib/client/action';

	let name = $state('');
	let submitting = $state(false);

	/**
	 * @param {SubmitEvent} e
	 */
	async function handleSubmit(e) {
		e.preventDefault();

		submitting = true;

		try {
			await action('?/login', { name });
		} catch (error) {
			console.error(error);
		} finally {
			submitting = false;
		}
	}
</script>

<form onsubmit={handleSubmit}>
	<input type="text" bind:value={name} placeholder="Name" />
	<button type="submit" disabled={submitting}>
		{#if submitting}
			<iconify-icon icon="fa6-solid:spinner"></iconify-icon>
		{:else}
			Login
		{/if}
	</button>
</form>
