import { db } from '$lib/server/db';
import { error } from '@sveltejs/kit';

export const actions = {
	async new({ request }) {
		const body = await request.json();

		const project = {
			name: body.name ?? '',
			image: body.image ?? '',
			difficulty: body.difficulty ?? 0,
			createdAt: new Date()
		};

		if (!project.name) {
			throw error(400, 'Name is required');
		}

		if (!project.image) {
			throw error(400, 'Image is required');
		}

		const result = await db.projects.insertOne(project);

		return {
			acknowledged: result.acknowledged,
			insertedId: result.insertedId.toJSON()
		};
	}
};
