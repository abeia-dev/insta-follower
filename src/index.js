require('dotenv').config()
const puppeteer = require('puppeteer')
const delay = require('./utils/delay')
const { SignIn } = require('./services/sign-in')
const { Follow } = require('./services/follow')
const env = require('./config')
;(async () => {
	const browser = await puppeteer.launch({ headless: false })

	try {
		const page = await browser.newPage()
		await page.setViewport({ width: 1080, height: 1080 })

		await SignIn(page, env.IG_USER, env.IG_PASS)

		await page.waitForNavigation()
		await delay(2000)

		await Follow(page, env.FOLLOW_PROFILE, env.FOLLOW_LIMIT)
	} catch (error) {
		console.error('\nBot ends with', error)
	} finally {
		await browser.close()
		console.log(`\nThe bot ended up crawling!`)
	}
})()
