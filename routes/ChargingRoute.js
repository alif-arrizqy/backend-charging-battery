import express from 'express'
import { cmsData, rectifierData, totalBatteryVoltage, updateStatusTest, updateResultStatus, updateStatusChecking, validateTime, checkTemperature, checkBatteryVoltage, clearRealtimeTable} from '../controllers/ChargingController.js'

var router = express.Router()

router.post('/check-battery-voltage', checkBatteryVoltage)
router.post('/cms-data', cmsData)
router.get('/rectifier-data', rectifierData)
router.put('/update-status-test', updateStatusTest)
router.put('/update-result-status', updateResultStatus)
router.put('/update-status-checking', updateStatusChecking)
router.get('/validate-time', validateTime)
router.post('/check-temperature', checkTemperature)
router.get('/clear-realtime-table', clearRealtimeTable)
router.get('/total-battery-valtage', totalBatteryVoltage)

export default router
