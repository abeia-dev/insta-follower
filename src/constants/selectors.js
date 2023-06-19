const signInPage = {
	loginInputField: 'input[name="username"]',
	passwordInputField: 'input[name="password"]',
	signInButton: 'button[type=submit]',
}

const followersPage = {
	actionButton: '[role="dialog"] button [dir="auto"]',
	tryLaterModal:
		'div[role="dialog"] div[role="dialog"]',
}

module.exports = { signInPage, followersPage }
