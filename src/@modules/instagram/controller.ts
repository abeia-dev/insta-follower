import puppeteer from 'puppeteer'
import { Request, Response } from 'express'
import crypto from 'crypto'

import * as SignService from '../../@bot/sign'
import * as FollowService from '../../@bot/follow'
import { addLog, getLog, updateLogStatus, getLogStatus } from '../../utils/log-status'

export const followProfileFollowers = (req: Request, res: Response) => {
	const botProcessId = crypto.randomUUID()

	updateLogStatus(`${botProcessId}`, 'PROCESSING')
	puppeteer.launch({ headless: false }).then(async (browser) => {
		const page = await browser.newPage()
		await page.setViewport({ width: 1080, height: 1080 })

		await SignService.SignIn(botProcessId, page, `${req.body.username}`, `${req.body.password}`)
		await FollowService.Follow(botProcessId, page, `${req.body.targetProfile}`, +`${req.body.followLimit}`)

		await browser.close()

		addLog(botProcessId, `Bot insta-follower has finished 'follow' action! tks!`)
		updateLogStatus(`${botProcessId}`, 'COMPLETED')
	})

	res.json({
		message: `Async process was initialized, you can follow the status making a GET on /instagram/status/${botProcessId}`,
		botProcessId,
	})
}

export const findStatus = (req: Request, res: Response) => {
	const currentStatus = getLogStatus(req.params.id)
	const logList = getLog(req.params.id)

	if (logList.length === 0) {
		return res.status(404).json({
			message: `Your process ${req.params.id} was not found`,
		})
	}

	const logData = logList.join('\n')
	let statusCode = 200

	if (currentStatus === 'PROCESSING') {
		statusCode = 206
	}

	return res.status(statusCode).send(logData)
}
