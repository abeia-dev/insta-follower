const delay = (delayTime: number) =>
	new Promise((r, _) => setTimeout(r, delayTime))

export default delay
