import { Router } from 'express'
import { convert, searchByDates, searchGroupByHour } from '../controllers/conversion.controller.js'
import { saveImage } from '../middleware/saveImage.js'
import { parse } from '../middleware/parseToPNG.js'

const conversionRouter = Router()

conversionRouter.post('/convert', saveImage, parse, convert)

conversionRouter.get('/search', searchByDates)

conversionRouter.get('/resume', searchGroupByHour)

export { conversionRouter }