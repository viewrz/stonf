import 'graphql';
import { graphqlLambda, graphiqlLambda } from 'apollo-server-lambda';
import { hashSync } from 'bcryptjs';

// aws-sdk is already included on lambda
// eslint-disable-next-line import/no-extraneous-dependencies
import S3 from 'aws-sdk/clients/s3';

import schema from './schema';
import getData from './s3-data';
import { parseToken } from './auth';

export const graphql = graphqlLambda(async request => ({
  schema,
  context: await parseToken(request, await getData()),
}));
export const graphiql = graphiqlLambda({ endpointURL: 'graphql' });

export const fixtures = (_, __, cb) =>
  new S3().putObject(
    {
      Body: JSON.stringify({
        users: [
          {
            username: 'admin',
            passwordHash: hashSync('admin'),
            lastUpdated: Math.floor(Date.now() / 1000),
          },
        ],
        confs: [],
      }),
      Key: 'data',
      ServerSideEncryption: 'AES256',
      Bucket: process.env.S3_BUCKET_DATA_NAME,
    },
    cb,
  );
