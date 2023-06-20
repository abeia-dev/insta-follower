import readline from 'readline'

export const read = async (text: string = ''): Promise<string> => {
	return new Promise((resolve, _) => {
		const prompt = readline.createInterface({
			input: process.stdin,
			output: process.stdout,
		})

		prompt.question(`${text} `, (inputed) => {
			prompt.close()
			resolve(inputed)
		})
	})
}
