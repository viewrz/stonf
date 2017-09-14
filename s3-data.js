// aws-sdk is already included on lambda
// eslint-disable-next-line import/no-extraneous-dependencies
import S3 from 'aws-sdk/clients/s3';

const s3 = new S3();

const data = async () =>
  s3
    .getObject({
      Key: 'data',
      Bucket: process.env.S3_BUCKET_DATA_NAME,
    })
    .promise()
    .then(d => JSON.parse(d.Body));

const save = async ({ users, confs }) =>
  s3
    .putObject({
      Body: JSON.stringify({ users, confs }),
      Key: 'data',
      ServerSideEncryption: 'AES256',
      Bucket: process.env.S3_BUCKET_DATA_NAME,
    })
    .promise();

export default async () => {
  const d = await data();
  d.users.save = save.bind(null, d);
  d.confs.save = save.bind(null, d);
  return d;
};
