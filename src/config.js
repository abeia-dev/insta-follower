const { IG_USER, IG_PASS, FOLLOW_LIMIT, FOLLOW_PROFILE } = process.env

module.exports = {
	IG_USER,
	IG_PASS,
	FOLLOW_LIMIT: +`${FOLLOW_LIMIT}`,
	FOLLOW_PROFILE,
}