import express from 'express'
import { powerModuleRectifier, setMaxRectifierCurrent, setRectifierCurrent, setRectifierVoltage } from '../controllers/RectifierController.js'

var router = express.Router()

router.get('/power-module-rectifier/:init', powerModuleRectifier)
router.get('/set-max-rectifier-current/:init', setMaxRectifierCurrent)
router.get('/set-rectifier-current/:init', setRectifierCurrent)
router.get('/set-rectifier-voltage/:init', setRectifierVoltage)

export default router