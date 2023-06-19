const cssSelectors = require('../constants/selectors')
const pageUrls = require('../constants/urls')
const delay = require('../utils/delay')

const Follow = async (page, username, limit) => {
	let followed = 0

	await page.goto(pageUrls.followersPage(username))
	await delay(2000)

	const followProfileFollowers = async (initialIndex) => {
		await delay(3000)
		let actionButtons = await page.$$(cssSelectors.followersPage.actionButton)
		console.log(
			`\n${actionButtons.length} buttons found, sweeping [${initialIndex}-${
				initialIndex - 1 + 12
			}]\n`
		)

		actionButtons = actionButtons.slice(initialIndex, initialIndex + 12)

		if (actionButtons.length !== 0) {
			for (const button of actionButtons) {
				if (followed >= limit) {
					throw new Error(`\nFollowed accounts limit reached! (${limit})\n`)
				}

				const buttonText = await button.evaluate((e) => {
					e.scrollIntoView()
					return e.textContent
				})

				await delay(1000)

				if (buttonText === 'Follow') {
					await button.click()
					followed++

					console.log(`${followed} accounts followed`)

					await delay(Math.random() * (6000 - 5000) + 5000)

					const modals = await page.$$(cssSelectors.followersPage.tryLaterModal)

					const modalsFound = modals.length
					if (modalsFound > 1) {
						const modalTime = new Date().getTime()

						await page.screenshot({
							path: `screenshots/error-${modalTime}.png`,
						})

						throw new Error(
							`\nToo many instagram actions - ref.: ./screenshots/error-${modalTime}.png\n`
						)
					}
				}
			}

			await followProfileFollowers(initialIndex + 12)
		}
	}

	await followProfileFollowers(0)
}

module.exports = { Follow }
