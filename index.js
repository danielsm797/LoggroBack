import express from 'express'
import { logger } from './config/winston.js'
import { conversionRouter } from './routers/conversion.router.js'

export const start = () => {

  const app = express()

  // Adding the routers

  app.use('/api/conversions', conversionRouter)

  // Start the API

  const port = process.env.API_PORT

  app.listen(port, () => {
    logger.info(`💻 API IS RUNNING AT ${port}`)
  })
}