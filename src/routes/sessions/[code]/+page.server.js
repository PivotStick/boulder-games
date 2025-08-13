import { db } from '$lib/server/db';
import { error } from '@sveltejs/kit';

export async function load({ params }) {
	let session = await db.sessions.findOne({ code: params.code });

	if (!session) {
		const result = await db.sessions.insertOne({
			code: params.code,
			createdAt: new Date(),
			users: []
		});

		session = await db.sessions.findOne({ _id: result.insertedId });

		if (!session) {
			throw error(500, 'Failed to create session');
		}
	}

	return {
		session: {
			...session,
			_id: session._id.toJSON()
		}
	};
}
