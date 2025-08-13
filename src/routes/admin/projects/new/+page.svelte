<script>
	import { goto } from '$app/navigation';
	import { action } from '$lib/client/action';
	import { difficulties } from '$lib/client/difficulties';
	import { fileToBase64 } from '$lib/client/fileToBase64';

	const payload = $state({
		name: '',
		image: /** @type {FileList | null}*/ (null),
		difficulty: 0
	});

	let submitting = $state(false);

	/**
	 * @type {string | null}
	 */
	let base64image = $state(null);

	/**
	 * @param {SubmitEvent} e
	 */
	async function submit(e) {
		e.preventDefault();

		if (!payload.name || !base64image) {
			return;
		}

		submitting = true;

		try {
			const result = await action('?/new', {
				name: payload.name,
				difficulty: payload.difficulty,
				image: base64image
			});

			if (result?.acknowledged) {
				await goto('/admin/projects');
			}
		} catch (error) {
			console.error(error);
		} finally {
			submitting = false;
		}
	}

	$effect(() => {
		if (payload.image?.[0]) {
			fileToBase64(payload.image?.[0]).then((value) => (base64image = value));
		}
	});
</script>

<h1>New project</h1>

<form onsubmit={submit}>
	<input type="text" bind:value={payload.name} placeholder="Name" />
	<select bind:value={payload.difficulty}>
		{#each difficulties as difficulty}
			<option value={difficulty.value}>{difficulty.label}</option>
		{/each}
	</select>
	<input type="file" bind:files={payload.image} placeholder="Image" accept="image/*" />
	{#if base64image}
		<img src={base64image} alt="Preview" />
	{/if}
	<button type="submit" disabled={submitting}>
		{#if submitting}
			<iconify-icon icon="fa6-solid:spinner"></iconify-icon>
		{:else}
			Submit <iconify-icon icon="fa6-solid:paper-plane"></iconify-icon>
		{/if}
	</button>
</form>

<style>
	img {
		height: 15rem;
		width: 100%;
		object-fit: cover;
		border-radius: 0.5rem;
	}
</style>
