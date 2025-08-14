import { db } from '$lib/server/db';
import { error } from '@sveltejs/kit';

export async function load({ locals, params }) {
	await db.sessions.deleteOldSessions();

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

	if (!session.users.find((user) => user._id === locals.user._id)) {
		session.users.push({
			_id: locals.user._id,
			name: locals.user.name,
			maxHealth: 3,
			health: 3,
			score: 0,
			level: locals.user.level,
			projects: {}
		});

		await db.sessions.updateOne({ _id: session._id }, { $set: { users: session.users } });
	}

	const projects = await db.projects.find();

	return {
		session: {
			...session,
			_id: session._id.toJSON()
		},
		projects: projects.map((project) => ({
			...project,
			_id: project._id.toJSON()
		}))
	};
}

export const actions = {
	async increment({ request, locals, params }) {
		const { projectId, type } = await request.json();
		const session = await db.sessions.findOne({ code: params.code });

		if (!session) {
			throw error(404, 'Session not found');
		}

		const userIndex = session.users.findIndex((user) => user._id === locals.user._id);
		const user = session.users[userIndex];

		if (!user) {
			throw error(404, 'You are not in session');
		}

		if (user.health <= 0) {
			throw error(400, 'You are dead');
		}

		const userProject = (user.projects[projectId] ??= {
			fellCount: 0,
			halfFinishedCount: 0,
			finishedCount: 0
		});

		if (type === 'fellCount') {
			user.health--;
			userProject.fellCount++;
		} else if (type === 'halfFinishedCount') {
			if (userProject.halfFinishedCount === 0 && userProject.finishedCount === 0) {
				user.score += 0.5;
			} else {
				user.health = Math.min(user.health + 1, user.maxHealth);
			}

			userProject.halfFinishedCount++;
		} else if (type === 'finishedCount') {
			if (userProject.finishedCount === 0) {
				user.score += userProject.halfFinishedCount === 0 ? 1 : 0.5;
			} else {
				user.health = Math.min(user.health + 1, user.maxHealth);
			}

			userProject.finishedCount++;
		}

		await db.sessions.updateOne({ _id: session._id }, { $set: { [`users.${userIndex}`]: user } });

		return { success: true };
	}
};
