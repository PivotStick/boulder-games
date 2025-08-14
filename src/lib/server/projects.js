import { Collection } from './collection';

/**
 * @extends {Collection<{
 * 	name: string;
 * 	image: string;
 * 	difficulty: number;
 * 	createdAt: Date;
 * }>}
 */
export class ProjectCollection extends Collection {
	constructor() {
		super('projects');
	}
}
