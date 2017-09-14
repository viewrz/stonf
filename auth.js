import { sign, verify } from 'jsonwebtoken';

export const parseToken = async ({ headers }, context) => {
  const parseAuth = /^Bearer (.*)$/.exec(headers.authorization || headers.Authorization);
  if (parseAuth) {
    try {
      const { iat, username } = verify(parseAuth[1], process.env.TOKEN_SIGN_SECRET);
      const user = context.users.find(u => u.username === username);
      // eslint-disable-next-line no-param-reassign
      if (user.lastUpdated <= iat) context.user = user;
    } catch (_) {
      // pass
    }
  }
  return context;
};

export const createToken = (username, timestamp) => ({
  token: sign({ username }, process.env.TOKEN_SIGN_SECRET),
  iat: timestamp,
});
