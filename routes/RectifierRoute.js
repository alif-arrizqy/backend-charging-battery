import express from 'express'
import { powerModuleRectifier, setRectifierCurrent, setRectifierVoltage, getSetting, insertDefaultSetting } from '../controllers/RectifierController.js'

var router = express.Router()

router.get('/power-module-rectifier/:init', powerModuleRectifier)
router.get("/get-setting", getSetting);
router.post('/set-rectifier-current', setRectifierCurrent)
router.post("/insert-default-setting", insertDefaultSetting );
router.post('/set-rectifier-voltage', setRectifierVoltage)

export default router