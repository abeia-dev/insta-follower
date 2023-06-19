import 'dotenv/config'
import puppeteer from 'puppeteer'
import env from './config/environment'
import delay from './utils/delay'
import * as SignService from './services/sign'
import * as FollowService from './services/follow'

const Bot = async () => {
	const browser = await puppeteer.launch({ headless: false })

	try {
		const page = await browser.newPage()
		await page.setViewport({ width: 1080, height: 1080 })

		await SignService.SignIn(page, env.IG_USER, env.IG_PASS)

		await page.waitForNavigation()
		await delay(2000)

		await FollowService.Follow(page, env.FOLLOW_PROFILE, env.FOLLOW_LIMIT)
	} catch (error) {
		console.error('\nBot ends with', error)
	} finally {
		await browser.close()
		console.log(`\nThe bot ended up crawling!`)
	}
}

export default Bot
