import { MONGO_URI } from '$env/static/private';
import { MongoClient } from 'mongodb';

const client = new MongoClient(MONGO_URI);
const taskliner = client.db('taskliner');

/**
 * @template {import('mongodb').Document} [TSchema=import('mongodb').Document]
 */
export class Collection {
	/**
	 * @type {import('mongodb').Collection<TSchema>}
	 */
	#c;

	/**
	 * @param {string} collectionName
	 * @param {TSchema} schema
	 */
	constructor(collectionName, schema) {
		this.#c = taskliner.collection(collectionName);
	}

	/**
	 * @param {import('mongodb').Filter<TSchema>=} filters
	 */
	find(filters = {}) {
		return this.#c.find(filters).toArray();
	}

	/**
	 * @param {import('mongodb').Filter<TSchema>=} filters
	 */
	findOne(filters = {}) {
		return this.#c.findOne(filters);
	}

	/**
	 * @param {import('mongodb').OptionalUnlessRequiredId<TSchema>} doc
	 */
	insertOne(doc) {
		return this.#c.insertOne(doc);
	}

	/**
	 * @param {import('mongodb').Filter<TSchema>} filters
	 * @param {import('mongodb').Document[] | import('mongodb').UpdateFilter<TSchema>} doc
	 */
	updateOne(filters, doc) {
		return this.#c.updateOne(filters, doc);
	}

	/**
	 * @param {import('mongodb').Filter<TSchema>} filters
	 */
	deleteOne(filters) {
		return this.#c.deleteOne(filters);
	}
}

export const db = {
	projects: new Collection('projects', {
		name: '',
		image: '',
		difficulty: 0,
		createdAt: new Date()
	}),
	sessions: new Collection('sessions', {
		code: '',
		users: /** @type {{
			name: string;
			maxHealth: number;
			health: number;
			score: number;
			level: number;
		}[]} */ ([]),
		createdAt: new Date()
	})
};
