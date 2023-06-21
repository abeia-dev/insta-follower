import 'dotenv/config'
import chalk from 'chalk'
import express, { Request, Response, NextFunction } from 'express'
import * as env from './config/environment'
import HealthCheckRouter from './@modules/health-check/routes'
import InstagramRouter from './@modules/instagram/routes'

console.clear()
const server = express()
server.use(express.json())

server.all('*', (req: Request, res: Response, next: NextFunction) => {
	console.log(`\n👉 ${chalk.redBright(req.method)} on ${chalk.cyan(req.path)}`)
	console.log(`🕑 ${new Date().toString()}\n`)
	next()
})

server.get('/', HealthCheckRouter)
server.use('/instagram', InstagramRouter)

server.listen(env.PORT, () => {
	console.log(`✅ ${chalk.greenBright('Express server')} is running and availble on port ${chalk.cyanBright(`:${env.PORT}`)}`)
})
