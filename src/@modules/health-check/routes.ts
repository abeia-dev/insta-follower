import { Request, Response } from 'express'

const HealthCheckRouter = (req: Request, res: Response) => {
	res.json({ message: 'insta-follower api is running!' })
}

export default HealthCheckRouter
