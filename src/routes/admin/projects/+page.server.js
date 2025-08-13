import { db } from '$lib/server/db';
import { ObjectId } from 'mongodb';

export async function load() {
	const projects = await db.projects.find();

	return {
		projects: projects.map((project) => ({
			...project,
			_id: project._id.toJSON()
		}))
	};
}

export const actions = {
	async delete({ request }) {
		const { id } = await request.json();

		return await db.projects.deleteOne({ _id: ObjectId.createFromHexString(id) });
	}
};
