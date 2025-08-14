import { db } from '$lib/server/db';
import { redirect } from '@sveltejs/kit';
import { ObjectId } from 'mongodb';

const COOKIE_NAME = '_sessionId_';

export async function handle({ event, resolve }) {
	const sessionId = event.cookies.get(COOKIE_NAME);

	if (sessionId) {
		const user = await db.users.findOne({ _id: new ObjectId(sessionId) });

		if (user) {
			event.locals.user = {
				_id: user._id.toString(),
				name: user.name,
				level: user.level
			};
		}
	}

	if (!event.locals.user && event.url.pathname !== '/auth') {
		throw redirect(302, '/auth');
	}

	return resolve(event);
}
