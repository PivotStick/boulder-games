import { Collection } from './Collection';

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
