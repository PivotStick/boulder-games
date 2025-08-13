import { db } from '$lib/server/db';
import { error } from '@sveltejs/kit';
import { ObjectId } from 'mongodb';

export async function load({ params }) {
	const project = await db.projects.findOne({ _id: ObjectId.createFromHexString(params.id) });

	if (!project) {
		throw error(404, 'Project not found');
	}

	return {
		project: {
			...project,
			_id: project._id.toJSON()
		}
	};
}

export const actions = {
	async patch({ request }) {
		const body = await request.json();

		const project = await db.projects.findOne({ _id: ObjectId.createFromHexString(body.id) });

		if (!project) {
			throw error(404, 'Project not found');
		}

		const updatedProject = {
			...project,
			name: body.name ?? project.name,
			difficulty: body.difficulty ?? project.difficulty,
			image: body.image ?? project.image
		};

		const result = await db.projects.updateOne(
			{ _id: ObjectId.createFromHexString(body.id) },
			{ $set: updatedProject }
		);

		return {
			acknowledged: result.acknowledged
		};
	}
};
