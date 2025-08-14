export const ssr = false;

export async function load({ locals }) {
	return {
		user: locals.user
	};
}
