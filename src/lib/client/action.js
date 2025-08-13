import { deserialize } from '$app/forms';

/**
 * @param {string} endpoint
 * @param {any} payload
 */
export async function action(endpoint, payload = undefined) {
	const response = await fetch(endpoint, {
		method: 'POST',
		body: payload ? JSON.stringify(payload) : undefined,
		headers: {
			'x-sveltekit-action': 'true'
		}
	});

	const result = deserialize(await response.text());

	switch (result.type) {
		case 'success':
			return result.data;

		case 'failure':
			throw result.data;

		case 'redirect':
			window.location.href = result.location;

		case 'error':
			throw result;

		default:
			throw new Error('Unknown action result');
	}
}
