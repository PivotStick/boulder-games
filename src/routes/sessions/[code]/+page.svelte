<script>
	import { invalidateAll } from '$app/navigation';
	import { action } from '$lib/client/action';
	import { difficulties } from '$lib/client/difficulties';
	import { snacks } from '$lib/components/Snacks.svelte';

	let { data } = $props();
	/** @type {string | null} */
	let incrementing = $state(null);

	const me = $derived.by(() => {
		const user = data.session.users.find((user) => user._id === data.user._id);

		if (!user) {
			throw new Error('User not found');
		}

		return user;
	});

	/**
	 * @param {string} projectId
	 * @param {string} type
	 */
	async function increment(projectId, type) {
		const project = data.projects.find((project) => project._id === projectId);

		if (!project) {
			throw new Error('Project not found');
		}

		incrementing = `${projectId}-${type}`;
		try {
			await action('?/increment', { projectId, type });
			await invalidateAll();
		} catch (error) {
			snacks.error(error);
		} finally {
			incrementing = null;
		}
	}
</script>

<div class="stats">
	<div class="difficulty-tag" data-difficulty={me.level}>{difficulties[me.level].label}</div>
	<div class="score">
		<div class="score-value">{me.score}</div>
		pts
	</div>
	<div class="name">{me.name}</div>
	<div class="health">
		<div class="health-value">{me.health}/{me.maxHealth}</div>
		<div class="health-container">
			<div class="health-bar success" style="width: {(me.health / me.maxHealth) * 100}%"></div>
		</div>
	</div>
</div>

<div class="projects">
	{#each data.projects as project}
		<div class="project">
			<img src={project.image} alt={project.name} />

			{#snippet action(
				/** @type {'fellCount' | 'halfFinishedCount' | 'finishedCount'} */ type,
				/** @type {string} */ icon,
				/** @type {string} */ _class
			)}
				<button
					class={_class}
					disabled={!!incrementing}
					onclick={() => increment(project._id, type)}
				>
					<iconify-icon
						icon="fa6-solid:{incrementing === `${project._id}-${type}` ? 'spinner' : icon}"
					></iconify-icon>
					| {me.projects[project._id]?.[type] ?? 0}
				</button>
			{/snippet}

			<div class="actions">
				{@render action('fellCount', 'person-falling-burst', 'danger')}
				{@render action('halfFinishedCount', 'circle-half-stroke', 'info')}
				{@render action('finishedCount', 'circle-check', 'success')}
			</div>

			<div class="infos">
				<div class="name">{project.name}</div>

				<span class="difficulty-tag" data-difficulty={project.difficulty}>
					{difficulties[project.difficulty].label}
				</span>
			</div>
		</div>
	{/each}
</div>

<style lang="scss">
	.projects {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(15rem, 1fr));
		gap: 2rem;

		.project {
			display: grid;
			gap: 0.5rem;
			padding-bottom: 1rem;
			border-bottom: 1px solid var(--color-100);

			img {
				display: block;
				height: 15rem;
				width: 100%;
				object-fit: cover;
				border-radius: 0.5rem;
			}

			.infos {
				display: flex;
				align-items: center;
				justify-content: space-between;
				gap: inherit;

				.name {
					font-size: 1.125rem;
					font-weight: 600;
				}
			}

			.actions {
				display: flex;
				gap: inherit;
			}
		}
	}

	.stats {
		position: sticky;
		top: 0;
		padding-top: 1rem;
		padding-bottom: 1rem;
		margin-bottom: -1rem;

		background-color: white;
		border-bottom: 1px solid var(--color-100);

		display: flex;
		align-items: center;
		gap: 1rem;

		.name {
			font-size: 1.25rem;
			font-weight: 600;
		}

		.score {
			display: flex;
			align-items: baseline;
			font-size: 0.875rem;
			font-weight: 600;

			color: var(--color-500);

			.score-value {
				font-size: 1.5rem;
				font-weight: 800;
			}
		}

		.health {
			flex: 1;

			display: flex;
			align-items: center;
			gap: 1.5rem;

			.health-container {
				border-radius: 0.5rem;

				flex: 1;
				height: 1rem;
				background-color: var(--color-200);

				.health-bar {
					border-radius: inherit;
					height: 100%;
					background-color: var(--color-500);

					transition-property: width;
				}
			}
		}
	}
</style>
