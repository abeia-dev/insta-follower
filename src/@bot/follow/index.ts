import { ElementHandle, Page } from 'puppeteer'
import chalk from 'chalk'
import * as selectors from '../selectors'
import * as urls from '../urls'
import delay from '../../utils/delay'
import { addLog } from '../../utils/log-status'

export const Follow = async (botProcessId: string, page: Page, username: string, limit: number): Promise<void> => {
	return new Promise(async (resolve, reject) => {
		try {
			let followed = 0
			let checkedAccounts = 0

			addLog(botProcessId, `Going to @${username} page`)

			await page.goto(urls.followersPage(username))
			await delay(5000)

			let actionButtons: ElementHandle<Element>[] = []
			let accountUsernames: ElementHandle<Element>[] = []

			let amIaFollower = false

			const sweepAccounts = async (start: number = 0) => {
				const foundActionButtons = (await page.$$(selectors.followersPage.actionButton)).slice(start)
				actionButtons = [...actionButtons, ...foundActionButtons]

				const foundAccountUsernames = (await page.$$(selectors.followersPage.usernames)).slice(amIaFollower ? start + 1 : start)
				accountUsernames = [...accountUsernames, ...foundAccountUsernames]

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
				const username = await accountUsernames[usernameIndex].evaluate((el) => el.textContent)

				await delay(2000)

				checkedAccounts++
				if (!['follow', 'seguir'].includes(`${actionText}`.toLocaleLowerCase())) {
					addLog(botProcessId, `The user @${username} was already followed before`)
					continue
				}

				await actionButton.click()

				followed++

				addLog(botProcessId, `The user @${username} was followed successfully`)
				await delay(2000)
			}

			addLog(botProcessId, `Follow limit reached: ${limit}`)
			addLog(botProcessId, `Followed accounts: ${followed}`)
			addLog(botProcessId, `Already followed before: ${checkedAccounts - followed}`)
			addLog(botProcessId, `Reached accounts: ${checkedAccounts}`)

			if (checkedAccounts - followed === checkedAccounts) {
				addLog(botProcessId, `Your account already follows all followers from @${username}`)
			}

			resolve()
		} catch (error) {
			reject(error)
		}
	})
}
