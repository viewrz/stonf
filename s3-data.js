// aws-sdk is already included on lambda
// eslint-disable-next-line import/no-extraneous-dependencies
import S3 from 'aws-sdk/clients/s3';

const s3 = new S3();

const data = s3
  .getObject({
    Key: 'data',
    Bucket: process.env.S3_BUCKET_DATA_NAME,
  })
  .promise()
  .then(d => JSON.parse(d.Body));

const save = async () =>
  s3
    .putObject({
      Body: JSON.stringify(await data),
      Key: 'data',
      ServerSideEncryption: 'AES256',
      Bucket: process.env.S3_BUCKET_DATA_NAME,
    })
    .promise();

const attachSave = (o) => {
  o.save = save; // eslint-disable-line no-param-reassign
  return o;
};

export default async () => ({
  users: attachSave((await data).users),
  confs: attachSave((await data).confs),
});
