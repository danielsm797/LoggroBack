import { readFileSync } from 'node:fs'
import { S3Client, PutObjectCommand, GetObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { logger } from '../config/winston.js'

const connect = () => {

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

  return { s3Client }
}

export const saveToS3 = async ({ to, name }) => {

  const obj = {
    dta: null,
    err: false
  };

  try {

    const bucket = process.env.AWS_BUCKET

    const { s3Client } = connect()

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

    logger.error(`❎ [saveToS3] -> ${error}`)

    obj.dta = error;

    obj.err = true;
  }

  return obj;
}

export const getS3Url = async ({ path }) => {

  const obj = {
    dta: null,
    err: false
  };

  try {

    const { s3Client } = connect()

    const params = {
      Bucket: process.env.AWS_BUCKET,
      Key: `restobares/${path}`,
    }

    // Si el recurso no existe, entra al catch

    const commandValidate = new HeadObjectCommand(params)
    await s3Client.send(commandValidate)

    const command = new GetObjectCommand(params)

    obj.dta = await getSignedUrl(s3Client, command, { expiresIn: 3600 })

  } catch (error) {

    logger.error(`❎ [getS3Url] -> ${error}`)

    obj.dta = error;

    obj.err = true;
  }

  return obj;
}