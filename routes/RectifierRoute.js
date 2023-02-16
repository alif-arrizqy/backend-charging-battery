import express from 'express'
import { powerModuleRectifier, setRectifierCurrent, setRectifierVoltage } from '../controllers/RectifierController.js'

var router = express.Router()

router.get('/power-module-rectifier/:init', powerModuleRectifier)
router.post('/set-rectifier-current', setRectifierCurrent)
router.post('/set-rectifier-voltage', setRectifierVoltage)

export default router