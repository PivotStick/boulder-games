import { Collection } from './collection';

/**
 * @extends {Collection<{
 * 	name: string;
 * 	level: number;
 * 	createdAt: Date;
 * }>}
 */
export class UserCollection extends Collection {
	constructor() {
		super('users');
	}
}
