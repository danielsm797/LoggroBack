import dotenv from 'dotenv'
import { connect } from 'mongoose'
import { join } from 'node:path'
import { fileURLToPath } from 'url';
import { logger } from './config/winston.js'
import { start } from './index.js'

const env = process.env.NODE_ENV || 'development';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

dotenv
  .config({
    path: join(__dirname, `./.env.${env}`)
  })

connect(process.env.MONGO_URL)
  .then(val => {
    logger.info('💾 Data base is runnig at 27017')
    start()
  })
  .catch(err => {
    logger.error('❎ Ha ocurrido un error iniciando la aplicación')
  })