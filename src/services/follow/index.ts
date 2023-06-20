import { ElementHandle, Page } from 'puppeteer'
import chalk from 'chalk'
import * as selectors from '../../constants/selectors'
import * as urls from '../../constants/urls'
import delay from '../../utils/delay'

export const Follow = async (page: Page, username: string, limit: number) => {
	let followed = 0
	let checkedAccounts = 0

	console.log(
		`🤖 -> Going to ${chalk.cyanBright(`@${username}`)} followers page`
	)

	await page.goto(urls.followersPage(username))
	await delay(3000)

	let actionButtons: ElementHandle<Element>[] = []
	let accountUsernames: ElementHandle<Element>[] = []

	let amIaFollower = false

	const sweepAccounts = async (start: number = 0) => {
		actionButtons = [
			...actionButtons,
			...(await page.$$(selectors.followersPage.actionButton)).slice(start),
		]

		accountUsernames = [
			...accountUsernames,
			...(await page.$$(selectors.followersPage.usernames)).slice(
				amIaFollower ? start + 1 : start
			),
		]

		amIaFollower = actionButtons.length !== accountUsernames.length
	}

	await sweepAccounts()

	for (let index = 0; index < actionButtons.length; index++) {
		if (followed >= limit) {
			break
		}

		await sweepAccounts(actionButtons.length)

		const actionButton = actionButtons[index]

		const actionText = await actionButton.evaluate((el) => {
			el.scrollIntoView()
			return el.textContent
		})

		const usernameIndex = amIaFollower ? index + 1 : index

		const username = await accountUsernames[usernameIndex].evaluate(
			(el) => el.textContent
		)

		await delay(2000)

		checkedAccounts++
		if (!['follow', 'seguir'].includes(`${actionText}`.toLocaleLowerCase())) {
			console.log(
				`🤣 -> The user ${chalk.cyanBright(
					`@${username}`
				)} was already followed`
			)
			continue
		}

		await actionButton.click()
		followed++
		console.log(
			`✅ -> Instagram user ${chalk.cyanBright(
				`@${username}`
			)} was followed successfully`
		)
		await delay(2000)
	}

	console.log(`\n👀 -> Follow limit defined: ${chalk.redBright(limit)}`)
	console.log(`🤖 -> Followed accounts: ${chalk.greenBright(followed)}`)
	console.log(
		`🤖 -> Already followed accounts: ${chalk.greenBright(
			checkedAccounts - followed
		)}`
	)
	console.log(`🤖 -> Reached accounts: ${chalk.greenBright(checkedAccounts)}`)

	if (checkedAccounts - followed === checkedAccounts) {
		console.log(
			`🤦 -> Your account already follows ${chalk.cyan(
				'all followers'
			)} from ${chalk.cyanBright(`@${username}`)}`
		)
	}
}
