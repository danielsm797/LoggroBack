import { Conversion } from '../data/conversion.data.js'
import { logger } from '../config/winston.js'
import { DateTime } from 'luxon'

export const convert = async (req, res) => {

  try {

    const { extension, name } = req.imageInfo

    const { user } = req.query

    const doc = {
      user,
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
        message: 'Conversion has been successfully!'
      })

  } catch (error) {

    logger.error(`❎ [convert] -> ${error}`)

    res
      .status(500)
      .json({
        success: false,
        message: 'Has been occurred an error, please try more late'
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
        message: 'Has been occurred an error, please try more late'
      })
  }
}