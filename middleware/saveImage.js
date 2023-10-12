import { Form } from 'multiparty'
import { createWriteStream } from 'node:fs'
import { resolve } from 'node:path'
import { fileURLToPath } from 'url'
import { logger } from '../config/winston.js'
import { VALID_EXTENSION } from '../utils/constants.js'

export const saveImage = (req, res, next) => {

  try {

    const { fileName } = req.query

    const form = new Form()

    form.on('part', part => {

      if (part.filename) {

        const __dirname = fileURLToPath(new URL('.', import.meta.url));

        const extension = part.filename.split('.').reverse()[0]

        // Validate the extension, only .jpeg and .jpg

        if (!VALID_EXTENSION.includes(extension.toLowerCase())) {

          return res
            .status(200)
            .json({
              success: false,
              message: `Image format invalid. Only permitted ${VALID_EXTENSION.toString()}`
            })
        }

        const name = `${fileName}-${new Date().getTime().toString()}`

        const saveTo = resolve(__dirname, `../public/imgs/temp/${name}.${extension}`)

        // Save in req for use in the next middleware

        req.imageInfo = {
          extension,
          name
        }

        part.pipe(createWriteStream(saveTo))
      }
    })

    form.on('close', () => {
      next()
    })

    form.on('error', () => {
      throw new Error('Error convert the form')
    })

    form.parse(req)

  } catch (error) {

    logger.error(`❎ [saveImage] -> ${error}`)

    res
      .status(500)
      .json({
        success: false,
        message: 'Has been occurred an error, please try more late'
      })
  }
}