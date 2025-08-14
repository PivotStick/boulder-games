import { db } from '$lib/server/db.js';

export async function load() {
	await db.sessions.deleteOldSessions();
	const sessions = await db.sessions.find();

	return {
		sessions: sessions.map((session) => ({
			...session,
			_id: session._id.toString()
		}))
	};
}
