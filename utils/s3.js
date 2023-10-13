import { readFileSync } from 'node:fs'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

export const saveToS3 = async ({ to, name }) => {

  const obj = {
    dta: null,
    err: false
  };

  try {

    const bucket = process.env.AWS_BUCKET
    const region = process.env.AWS_REGION
    const accessKeyId = process.env.AWS_ACCESS_KEY_ID
    const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY

    const s3Client = new S3Client({
      region,
      credentials: {
        accessKeyId,
        secretAccessKey
      }
    })

    const body = readFileSync(to)

    const params = {
      Bucket: bucket,
      Key: `restobares/${name}.png`,
      Body: body,
      ContentType: 'image/png'
    }

    const command = new PutObjectCommand(params)

    await s3Client.send(command)

  } catch (error) {

    obj.dta = error;

    obj.err = true;
  }

  return obj;
}
