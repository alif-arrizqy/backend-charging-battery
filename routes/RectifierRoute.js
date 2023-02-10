import express from 'express'
import { powerModuleRectifier, setMaxRectifierCurrent, setRectifierCurrent, setRectifierVoltage } from '../controllers/RectifierController.js'

var router = express.Router()

router.post('/power-module-rectifier/:init', powerModuleRectifier)
router.get('/set-max-rectifier-current', setMaxRectifierCurrent)
router.get('/set-rectifier-current', setRectifierCurrent)
router.get('/set-rectifier-voltage', setRectifierVoltage)

export default router