import chalk from 'chalk'

const logMemory: any = {}
const logStatusMemory: any = {}

export const addLog = (botProcessId: string, description: string) => {
	const logs = botProcessId in logMemory ? logMemory[botProcessId] : []
	logs.push(description)
	logMemory[botProcessId] = logs
	console.log(`👉 ${chalk.redBright(botProcessId)} - ${description}`)
}

export const getLog = (botProcessId: string): string[] => {
	return botProcessId in logMemory ? logMemory[botProcessId] : []
}

export const updateLogStatus = (botProcessId: string, status: string) => {
	logStatusMemory[botProcessId] = status
}

export const getLogStatus = (botProcessId: string) => {
	return botProcessId in logStatusMemory ? logStatusMemory[botProcessId] : undefined
}
