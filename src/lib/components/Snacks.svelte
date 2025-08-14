<script module>
	import { expoOut } from 'svelte/easing';
	import { slide } from 'svelte/transition';

	/**
	 * @typedef {{
	 *  type: 'success' | 'danger' | 'info' | 'warning';
	 *  title: string;
	 *  message: string;
	 *  icon: string;
	 * }} Snack
	 */

	export const snacks = {
		/**
		 * @param {string} message
		 */
		success: (message, title = 'Success') =>
			push({ type: 'success', message, title, icon: 'fa6-solid:circle-check' }),
		/**
		 * @param {string} message
		 */
		danger: (message, title = 'Danger') =>
			push({ type: 'danger', message, title, icon: 'fa6-solid:circle-xmark' }),
		/**
		 * @param {string} message
		 */
		info: (message, title = 'Info') =>
			push({ type: 'info', message, title, icon: 'fa6-solid:circle-info' }),
		/**
		 * @param {string} message
		 */
		warning: (message, title = 'Warning') =>
			push({ type: 'warning', message, title, icon: 'fa6-solid:circle-exclamation' }),

		/**
		 * @param {any} error
		 */
		error: (error) => {
			if (error instanceof Error) {
				push({
					type: 'danger',
					message: error.message,
					title: error.name,
					icon: 'fa6-solid:circle-xmark'
				});
			} else {
				let message = 'Unknown error';

				if (error?.error?.message) {
					message = error.error.message;
				}

				push({
					type: 'danger',
					message: message,
					title: 'Error',
					icon: 'fa6-solid:circle-xmark'
				});
				console.error(error);
			}
		}
	};

	/**
	 * @type {ReturnType<typeof setInterval>=}
	 */
	let interval;

	/**
	 * @param {Snack} snack
	 */
	function push(snack) {
		items.unshift(snack);

		if (interval !== undefined) {
			return;
		}

		interval = setInterval(() => {
			items.pop();

			if (items.length === 0) {
				clearInterval(interval);
				interval = undefined;
			}
		}, 5000);
	}

	/**
	 * @type {Snack[]}
	 */
	const items = $state([]);
</script>

<div class="snacks">
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	{#each items as snack (snack)}
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div
			class="snack {snack.type}"
			transition:slide={{ easing: expoOut, duration: 300 }}
			onclick={() => items.splice(items.indexOf(snack), 1)}
		>
			<div class="title">
				<iconify-icon icon={snack.icon}></iconify-icon>
				{snack.title}
			</div>
			<div class="message">{@html snack.message}</div>
		</div>
	{/each}
</div>

<style lang="scss">
	.snacks {
		position: fixed;

		right: 1rem;
		bottom: 0;
		.snack {
			padding: 1rem;
			border-radius: 0.5rem;
			background-color: var(--color-50);
			box-shadow: 0 1rem 1.25rem -1rem var(--color-900);
			border: 1px solid var(--color-300);
			color: var(--color-900);

			margin-bottom: 1rem;

			.title {
				display: flex;
				align-items: center;
				gap: 0.5rem;

				font-weight: 600;
				margin-bottom: 0.5rem;
			}
		}
	}
</style>
