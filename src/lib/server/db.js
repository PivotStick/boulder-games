import { ProjectCollection } from './projects';
import { SessionCollection } from './sessions';
import { UserCollection } from './users';

export const db = {
	projects: new ProjectCollection(),
	sessions: new SessionCollection(),
	users: new UserCollection()
};
