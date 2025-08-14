import { Collection } from './Collection';

/**
 * @extends {Collection<{
 * 	code: string;
 * 	users: {
 * 		_id: string;
 * 		name: string;
 * 		maxHealth: number;
 * 		health: number;
 * 		score: number;
 * 		level: number;
 * 		projects: Record<string, {
 * 			finishedCount: number;
 * 			halfFinishedCount: number;
 * 			fellCount: number;
 * 		}>;
 * 	}[];
 * 	createdAt: Date;
 * }>}
 */
export class SessionCollection extends Collection {
	constructor() {
		super('sessions');
	}

	deleteOldSessions() {
		const startOfDay = new Date();
		startOfDay.setHours(0, 0, 0, 0);

		return this.deleteMany({
			createdAt: {
				$lt: startOfDay
			}
		});
	}
}
