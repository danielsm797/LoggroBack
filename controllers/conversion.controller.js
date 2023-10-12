import { Conversion } from '../data/conversion.data.js'
import { logger } from '../config/winston.js'
import { Types } from 'mongoose'

export const convert = async (req, res) => {

  try {

    const { extension, name } = req.imageInfo

    const doc = {
      user: {
        _id: new Types.ObjectId(),
        name: `${name}.png`
      },
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