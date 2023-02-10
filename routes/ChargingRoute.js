import express from 'express'
import { cmsData, rectifierData, updateStatusTest, updateResultStatus, updateStatusChecking, validateTime, checkTemperature, checkBatteryVoltage, clearRealtimeTable} from '../controllers/ChargingController.js'

var router = express.Router()

router.get('/check-battery-voltage', checkBatteryVoltage)
router.get('/get-cms', cmsData)
router.get('/rectifier-data', rectifierData)
router.put('/update-status-test', updateStatusTest)
router.put('/update-result-status', updateResultStatus)
router.put('/update-status-checking', updateStatusChecking)
router.get('/validate-time', validateTime)
router.get('/check-temperature', checkTemperature)
router.get('/clear-realtime-table', clearRealtimeTable)

export default router
