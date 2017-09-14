/* eslint-disable no-underscore-dangle */
import GraphQLJSON from 'graphql-type-json';
import { hashSync, compareSync } from 'bcryptjs';
import { randomBytes } from 'crypto';
import { createToken } from '../auth';

const now = () => Math.floor(Date.now() / 1000);

const generate = () => randomBytes(9).toString('base64');

export default {
  JSON: GraphQLJSON,
  Query: {
    users: (_, __, { user, users }) => {
      if (!user) throw new Error('Unauthorized');
      return users;
    },
    confs: (_, __, { user, confs }) => {
      if (!user) throw new Error('Unauthorized');
      return confs;
    },
    confById: (_, { _id }, { confs }) => {
      const conf = confs.find(c => c._id === _id);
      if (!conf) throw new Error('Conf does not exist');
      return conf;
    },
  },
  Mutation: {
    login: async (_, { username, password }, { users }) => {
      const user = users.find(u => u.username === username);
      if (user && compareSync(password, user.passwordHash)) return createToken(username);
      throw new Error('Invalid username/password');
    },

    createConf: async (_, { name, vars }, { user, confs }) => {
      if (!user) throw new Error('Unauthorized');
      const conf = { name, vars, _id: generate() };
      confs.unshift(conf);
      await confs.save();
      return conf;
    },
    updateConf: async (_, { _id, name, vars }, { user, confs }) => {
      if (!user) throw new Error('Unauthorized');
      const conf = confs.find(c => c._id === _id);
      if (!conf) throw new Error('Conf does not exist');
      conf.name = name;
      conf.vars = vars;
      await confs.save();
      return conf;
    },
    cloneConf: async (_, { _id }, { user, confs }) => {
      if (!user) throw new Error('Unauthorized');
      const conf = confs.find(c => c._id === _id);
      if (!conf) throw new Error('Conf does not exist');
      const newConf = { name: conf.name, _id: generate(), vars: conf.vars };
      confs.unshift(newConf);
      await confs.save();
      return newConf;
    },
    deleteConf: async (_, { _id }, { user, confs }) => {
      if (!user) throw new Error('Unauthorized');
      const conf = confs.find(c => c._id === _id);
      if (!conf) throw new Error('Conf does not exist');
      confs.splice(confs.indexOf(conf), 1);
      await confs.save();
      return conf;
    },

    createUser: async (_, { username, password }, { user, users }) => {
      if (!user) throw new Error('Unauthorized');
      if (users.find(u => u.username === username)) throw new Error('User with same name exists');
      const newUser = { username, passwordHash: hashSync(password), lastUpdated: now() };
      users.push(newUser);
      await users.save();
      return newUser;
    },
    changePassword: async (_, { newPassword }, { user, users }) => {
      if (!user) throw new Error('Unauthorized');
      user.passwordHash = hashSync(newPassword); // eslint-disable-line no-param-reassign
      user.lastUpdated = now(); // eslint-disable-line no-param-reassign
      await users.save();
      return createToken(user.username, user.lastUpdated);
    },
    deleteUser: async (_, { username }, { user, users }) => {
      if (!user) throw new Error('Unauthorized');
      const userToDelete = users.find(u => u.username === username);
      if (!userToDelete) throw new Error('User does not exist');
      if (userToDelete.username === user.username) throw new Error('Cannot delete yourself');
      users.splice(users.indexOf(userToDelete), 1);
      await users.save();
      return userToDelete;
    },
  },
};
