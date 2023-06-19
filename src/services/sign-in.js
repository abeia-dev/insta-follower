const cssSelectors = require('../constants/selectors')
const pageUrls = require('../constants/urls')
const delay = require('../utils/delay')

const SignIn = async (page, username, password) => {
	await page.goto(pageUrls.signInPage)

	await page.waitForNetworkIdle()

	await delay(1000)

	await page.type(cssSelectors.signInPage.loginInputField, username)
	await page.type(cssSelectors.signInPage.passwordInputField, password)

	await page.click(cssSelectors.signInPage.signInButton)
}

module.exports = { SignIn }
