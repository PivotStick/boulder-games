import { dev } from '$app/environment';
import { db } from '$lib/server/db';
import { redirect } from '@sveltejs/kit';

export const actions = {
	async login({ request, cookies }) {
		const body = await request.json();
		const user = await db.users.findOne({ name: body.name });

		let sessionId = user?._id.toString();

		if (!sessionId) {
			const result = await db.users.insertOne({ name: body.name, level: 0, createdAt: new Date() });
			sessionId = result.insertedId.toString();
		}

		cookies.set('_sessionId_', sessionId, {
			path: '/',
			httpOnly: true,
			secure: !dev
		});

		throw redirect(307, '/');
	}
};
