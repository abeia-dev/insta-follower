import chalk from 'chalk'
import { Page } from 'puppeteer'
import * as selectors from '../../constants/selectors'
import * as urls from '../../constants/urls'
import delay from '../../utils/delay'

export const SignIn = async (
	page: Page,
	username: string,
	password: string
) => {
	try {
		console.log(`🤖 -> Going to ${chalk.cyanBright('login page')}`)
		await page.goto(urls.signInPage)

		await page.waitForNetworkIdle()

		await delay(1000)

		console.log(`🤖 -> Typing ${chalk.redBright('username')}`)
		await page.type(selectors.signInPage.loginInputField, username)

		console.log(`🤖 -> Typing ${chalk.redBright('password')}`)
		await page.type(selectors.signInPage.passwordInputField, password)

		console.log(`🤖 -> Submiting ${chalk.cyanBright('login')} page`)
		await page.click(selectors.signInPage.signInButton)
	} catch (error) {
		console.log(
			`🤬 -> It was ${chalk.redBright('not possible')} to ${chalk.cyanBright(
				'sign in'
			)}!\n`
		)
		throw error
	}
}
