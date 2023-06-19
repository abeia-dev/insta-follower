import { Page } from 'puppeteer'
import chalk from 'chalk'
import * as selectors from '../../constants/selectors'
import * as urls from '../../constants/urls'
import delay from '../../utils/delay'

export const Follow = async (page: Page, username: string, limit: number) => {
	let followed = 0

	console.log(
		`🤖 -> Going to ${chalk.cyanBright(`${username}'s`)} followers page`
	)

	await page.goto(urls.followersPage(username))
	await delay(2000)

	const followProfileFollowers = async (
		initialIndex: number
	): Promise<number> => {
		await delay(3000)
		let amIaFollower = false
		let actionButtons = await page.$$(selectors.followersPage.actionButton)
		let accountUsernames = await page.$$(selectors.followersPage.usernames)

		if (accountUsernames.length > actionButtons.length) {
			amIaFollower = true
		}

		console.log(
			`actionButtons: ${actionButtons.length}\naccountUsernames: ${accountUsernames.length}`
		)

		actionButtons = actionButtons.slice(initialIndex, initialIndex + 12)
		accountUsernames = accountUsernames.slice(initialIndex, initialIndex + 12)

		for (let i = 0; i < actionButtons.length; i++) {
			const button = actionButtons[i]

			if (followed >= limit) {
				console.log(
					`⚠️ -> Followers limit of  ${chalk.redBright(
						limit
					)} was ${chalk.greenBright('reached')}!`
				)
				break
			}

			const buttonText = await button.evaluate((e) => {
				e.scrollIntoView()
				return e.textContent
			})

			const usernameIndex = amIaFollower ? i + 1 : i
			const username = await accountUsernames[usernameIndex].evaluate(
				(e) => e.textContent
			)

			await delay(1000)

			if (['Follow', 'Seguir'].includes(`${buttonText}`)) {
				await button.click()
				followed++

				console.log(
					`✅ -> Instagram user ${chalk.cyanBright(
						`@${username}`
					)} was followed`
				)

				await delay(Math.random() * (6000 - 5000) + 5000)

				const modals = await page.$$(selectors.followersPage.tryLaterModal)

				const modalsFound = modals.length
				if (modalsFound > 1) {
					const modalTime = new Date().getTime()

					const screenshotPath = `./screenshots/${modalTime}.png`
					await page.screenshot({
						path: screenshotPath,
					})

					console.log(
						`🤬 -> Sh$%#t, instagram just blocked me saying: ${chalk.redBright(
							'too many actions'
						)}...\nBut don't worry, you should not be blocked!\n${chalk.bgRed.white(
							' YET! '
						)}`
					)

					console.log(
						`🤖 -> I just took a screenshot for you to see what happened ${chalk.cyanBright(
							screenshotPath
						)}`
					)

					break
				}
			}

			await followProfileFollowers(initialIndex + 12)
		}

		return followed
	}

	await followProfileFollowers(0)
}
