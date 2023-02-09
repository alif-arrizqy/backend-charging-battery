import express from 'express'
import { checkStatus, shutdownCharging } from '../controllers/ChargingController.js'

var router = express.Router()

router.get('/cms-data', checkStatus)
router.get('/shutdown-charging', shutdownCharging)

export default router
