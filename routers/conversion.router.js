import { Router } from 'express'
import { convert, searchByDates } from '../controllers/conversion.controller.js'
import { saveImage } from '../middleware/saveImage.js'
import { parse } from '../middleware/parseToPNG.js'

const conversionRouter = Router()

conversionRouter.post('/convert', saveImage, parse, convert)

conversionRouter.get('/search', searchByDates)

export { conversionRouter }