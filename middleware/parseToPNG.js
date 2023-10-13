import { logger } from '../config/winston.js'
import { fileURLToPath } from 'url'
import { resolve } from 'node:path'
import { rm } from 'node:fs/promises'
import sharp from 'sharp'
import { saveToS3 } from '../utils/s3.js'

export const parse = async (req, res, next) => {

  try {

    const __dirname = fileURLToPath(new URL('.', import.meta.url));

    const { extension, name } = req.imageInfo

    const from = resolve(__dirname, `../public/imgs/temp/${name}.${extension}`)
    const to = resolve(__dirname, `../public/imgs/result/${name}.png`)

    const result = await sharp(from)
      .resize(null, 700)
      .toFile(to)

    if (!result) {
      throw new Error('Error parsing to png')
    }

    const resultDel = await deleteImageTemp({ from })

    if (resultDel.err) {
      throw resultDel.dta
    }

    await saveToS3({ to, name })

    next()

  } catch (error) {

    console.log('error :>> ', error);

    logger.error(`❎ [parse] -> ${error}`)

    res
      .status(500)
      .json({
        success: false,
        message: 'Ha ocurrido un error, por favor intente de luego más tarde'
      })
  }
}

const deleteImageTemp = async ({ from }) => {

  const obj = {
    dta: null,
    err: false
  };

  try {

    await rm(from)

  } catch (error) {

    obj.dta = error;

    obj.err = true;
  }

  return obj;
}
