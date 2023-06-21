import chalk from 'chalk'
import { Page } from 'puppeteer'
import * as selectors from '../selectors'
import * as urls from '../urls'
import delay from '../../utils/delay'
import { addLog } from '../../utils/log-status'

export const SignIn = async (botProcessId: string, page: Page, username: string, password: string): Promise<void> => {
	return new Promise(async (resolve, reject) => {
		try {
			addLog(botProcessId, 'Going to login page')
			await page.goto(urls.signInPage)
			await page.waitForNetworkIdle()
			await delay(1000)

			addLog(botProcessId, 'Typing account username')
			await page.type(selectors.signInPage.loginInputField, username)

			addLog(botProcessId, 'Typing account password')
			await page.type(selectors.signInPage.passwordInputField, password)

			addLog(botProcessId, 'Submiting loggin page')
			await page.click(selectors.signInPage.signInButton)

			await page.waitForNavigation()

			resolve()
		} catch (error) {
			addLog(botProcessId, `ÏIt was not possible to sign in (@${username}) account`)
			reject(error)
		}
	})
}
