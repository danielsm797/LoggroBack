import { Conversion } from '../data/conversion.data.js'
import { logger } from '../config/winston.js'
import { DateTime } from 'luxon'
import { getS3Url } from '../utils/s3.js'

export const convert = async (req, res) => {

  try {

    const { extension, name } = req.imageInfo

    const { userName } = req.query

    const doc = {
      user: userName,
      path: `${name}.png`,
      prevExtension: extension
    }

    const result = await Conversion.create({ doc })

    if (result.err) {
      throw result.dta
    }

    res
      .status(200)
      .json({
        success: true,
        message: 'Imagen procesada y guardada exitosamente!'
      })

  } catch (error) {

    logger.error(`❎ [convert] -> ${error}`)

    res
      .status(500)
      .json({
        success: false,
        message: 'Ha ocurrido un error, por favor intente de luego más tarde'
      })
  }
}

export const searchByDates = async (req, res) => {

  try {

    const { fi, ff } = req.query

    const start = DateTime.fromISO(fi).toUTC()
    const end = DateTime.fromISO(ff).toUTC()

    const filter = {
      createdAt: {
        $gte: start,
        $lte: end
      }
    }

    const fields = {
      path: 1,
      prevExtension: 1,
      createdAt: 1,
      user: 1
    }

    const result = await Conversion.searchByFilter({ filter, fields })

    if (result.err) {
      throw result.dta
    }

    // Generamos la URL para cada imagen

    for (const k of result.dta) {

      const resultUrl = await getS3Url({ path: k.path })

      if (resultUrl.err) {
        continue
      }

      k.s3 = resultUrl.dta
    }

    res
      .status(200)
      .json({
        success: true,
        message: 'Query has been successfully!',
        object: result.dta
      })

  } catch (error) {

    logger.error(`❎ [searchByDates] -> ${error}`)

    res
      .status(500)
      .json({
        success: false,
        message: 'Ha ocurrido un error, por favor intente de luego más tarde'
      })
  }
}

export const searchGroupByHour = async (req, res) => {

  try {

    const { fi, ff } = req.query

    const start = DateTime.fromISO(fi).toUTC()
    const end = DateTime.fromISO(ff).toUTC()

    const result = await Conversion.searchGroupByHour({ start, end })

    if (result.err) {
      throw result.dta
    }

    res
      .status(200)
      .json({
        success: true,
        message: 'Query has been successfully!',
        object: result.dta
      })

  } catch (error) {

    logger.error(`❎ [searchGroupByHour] -> ${error}`)

    res
      .status(500)
      .json({
        success: false,
        message: 'Ha ocurrido un error, por favor intente de luego más tarde'
      })
  }
}