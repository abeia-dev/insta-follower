import express, { Request, Response } from 'express'
import { followProfileFollowers, findStatus } from './controller'

const router = express.Router()

router.post('/follow', followProfileFollowers)
router.get('/status/:id', findStatus)

export default router
