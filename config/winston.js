import { createLogger, format, transports } from 'winston'
import { fileURLToPath } from 'url';
import { resolve } from 'node:path'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const logFormat = format.printf(info => `[${info.timestamp}] ${info.level} - ${info.message}`)

export const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.json(),
    logFormat
  ),
  transports: [
    new transports.File({ filename: resolve(__dirname, '../logs/api.log') }),
    new transports.Console({
      format: format.combine(
        format.colorize(),
        logFormat
      )
    })
  ],
  exitOnError: false
})