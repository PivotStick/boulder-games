<script>
	import { goto } from '$app/navigation';

	let { data } = $props();

	let sessionID = $state('');
	let submitting = $state(false);

	/**
	 * @param {SubmitEvent} e
	 */
	async function handleSubmit(e) {
		e.preventDefault();

		if (!sessionID) {
			return;
		}

		submitting = true;

		try {
			await goto(`/sessions/${sessionID}`);
		} catch (error) {
			console.error(error);
		} finally {
			submitting = false;
		}
	}
</script>

<h1>Welcome to Boulder Games</h1>

<a href="/admin/projects">Projects</a>

<form onsubmit={handleSubmit}>
	<input type="text" placeholder="Session ID" bind:value={sessionID} />
	<button type="submit" disabled={submitting || !sessionID}>
		{#if submitting}
			<iconify-icon icon="fa6-solid:spinner"></iconify-icon>
		{:else}
			Join <iconify-icon icon="fa6-solid:arrow-right"></iconify-icon>
		{/if}
	</button>
</form>

<h2>Sessions</h2>

<div class="sessions">
	{#each data.sessions as session}
		<a href="/sessions/{session.code}">{session.code} - {session.users.length} users</a>
	{/each}
</div>
