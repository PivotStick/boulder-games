<script>
	import { goto, invalidateAll } from '$app/navigation';
	import { action } from '$lib/client/action.js';
	import { difficulties } from '$lib/client/difficulties.js';

	let { data } = $props();

	/**
	 * @type {{[key: string]: { deleting?: boolean; }}}
	 */
	let pendings = $state({});

	/**
	 * @param {string} id
	 */
	async function deleteProject(id) {
		pendings[id] ??= {};
		pendings[id].deleting = true;

		try {
			await action(`?/delete`, { id });
			await invalidateAll();
		} catch (error) {
			console.error(error);
		} finally {
			pendings[id].deleting = false;
		}
	}
</script>

<h1>Projects</h1>

<a href="/">Home</a>

<div class="projects">
	{#each data.projects as project}
		<div class="project">
			<img src={project.image} alt={project.name} />
			<h2>{project.name}</h2>
			<p>
				<span class="difficulty-tag" data-difficulty={project.difficulty}>
					{difficulties[project.difficulty].label}
				</span>
			</p>
			<p>{project.createdAt.toLocaleString()}</p>
			<div class="actions">
				<button
					class="primary"
					aria-label="Edit project"
					onclick={() => goto(`/admin/projects/${project._id}/edit`)}
				>
					<iconify-icon icon="fa6-solid:pen"></iconify-icon>
				</button>
				<button
					class="danger"
					onclick={() => deleteProject(project._id)}
					aria-label="Delete project"
					disabled={pendings[project._id]?.deleting}
				>
					{#if pendings[project._id]?.deleting}
						<iconify-icon icon="fa6-solid:spinner"></iconify-icon>
					{:else}
						<iconify-icon icon="fa6-solid:trash"></iconify-icon>
					{/if}
				</button>
			</div>
		</div>
	{/each}
	<a href="/admin/projects/new" aria-label="New project" class="project new primary">
		<iconify-icon icon="fa6-solid:plus"></iconify-icon>
	</a>
</div>

<style lang="scss">
	.projects {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(20rem, 1fr));
		gap: 2rem;

		.project {
			border: 1px solid var(--color-200);
			background-color: white;
			padding: 1rem;
			border-radius: 1.5rem;
			box-shadow: 0 1rem 2rem -1rem var(--color-400);

			display: grid;
			gap: 0.5rem;

			img {
				display: block;
				width: 100%;
				height: 15rem;
				object-fit: cover;

				border-radius: 0.5rem;
			}

			&.new {
				background-color: var(--color-100);
				color: var(--color-600);
				box-shadow: none;
				cursor: pointer;

				display: flex;
				align-items: center;
				justify-content: center;
				gap: 0.5rem;

				font-size: 2rem;

				transition-property: background-color, opacity;

				&:hover {
					background-color: var(--color-200);
				}

				&:active {
					opacity: 0.5;
				}
			}

			.actions {
				display: flex;
				gap: 0.5rem;
				margin-top: 1rem;

				button {
					flex: 1;
				}
			}
		}
	}
</style>
