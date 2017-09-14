import { hashSync } from 'bcryptjs';

export const users = [
  { username: 'user1', passwordHash: hashSync('u1'), lastUpdated: 0 },
  { username: 'user2', passwordHash: hashSync('u2'), lastUpdated: 0 },
];
users.save = () => null;

export const confs = [
  { _id: 'nEhqSN0sOruq', name: 'conf 1', vars: { VAR_1: 'super1', VAR_2: 'super2' } },
  { _id: 'qViARdzWLzGC', name: 'conf 2', vars: { VAR_3: 'super3', VAR_4: 'super4' } },
];
confs.save = () => null;
