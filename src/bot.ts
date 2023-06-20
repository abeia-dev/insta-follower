import 'dotenv/config'
import chalk from 'chalk'
import puppeteer from 'puppeteer'
import delay from './utils/delay'
import * as SignService from './services/sign'
import * as FollowService from './services/follow'
import * as prompt from './utils/prompt'

const Bot = async () => {
	console.clear()
	console.log(`🤖 ${chalk.bgWhite.black(' insta-follower ')} bot 🤖\n\n`)
	const browser = await puppeteer.launch({ headless: 'new' })

	try {
		const page = await browser.newPage()
		await page.setViewport({ width: 1080, height: 1080 })

		await delay(400)
		console.log(`\n🤖 -> Please, choose the action you need:`)
		await delay(400)
		console.log(`1️⃣  -> Follow the followers of a user account\n`)
		await delay(400)
		const choice = await prompt.read('Your option:')

		console.log(`\n🤖 -> Thanks! You choosed option: ${choice}\n`)
		await delay(1000)

		console.log(`🤖 -> Now I need your instagram account username (without @)`)
		const instaUsername = await prompt.read('>')

		console.log(
			`\n🤖 -> Ok, now I need your instagram account password (without 2FA)`
		)
		const instaPassword = await prompt.read('>')

		console.clear()
		console.log(`🤖 ${chalk.bgWhite.black(' insta-follower ')} bot 🤖\n\n`)

		await SignService.SignIn(page, instaUsername, instaPassword)

		await page.waitForNavigation()
		await delay(2000)

		console.log(
			`🤖 -> Nice, I'm actually logged in your account (${chalk.cyanBright(
				`@${instaUsername}`
			)})! 😬`
		)
		await delay(400)

		console.log(
			`\n🤖 -> Now I need to know which profile you want to follow its followers`
		)

		const followProfileUsername = await prompt.read(
			'Profile username (whithout @):'
		)
		await delay(400)

		console.log(
			`\n🤖 -> Now tell me how many users you want to follow from ${chalk.cyanBright(
				`@${followProfileUsername}`
			)} (Instagram follow limit is something like 150 a day 🙄)`
		)
		const followLimit = await prompt.read('Limit (only a number):')
		await delay(400)

		console.log(`\n🤖 -> Noooice!`)
		console.log(`\n🤖 -> I'm about to do my magic!\n\n`)
		await delay(400)

		await FollowService.Follow(page, followProfileUsername, +followLimit)
	} catch (error) {
		console.error('\nBot ends with', error)
	} finally {
		await browser.close()
		console.log(`\nThe bot ended up crawling!`)
	}
}

export default Bot
