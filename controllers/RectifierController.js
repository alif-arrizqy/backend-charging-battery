import axios from 'axios'
import dotenv from 'dotenv'
import M_frame from '../models/M_frameModel.js'
import configCharging from '../config/configCharging.js'
import { mainProgram, updateResultStatus, updateStatusChecking, updateStatusTest, validateTime } from './ChargingController.js'

const env = dotenv.config().parsed

const powerModuleRectifier = async (init) => {
    if (init) {
        // body = {
        //     "group": 0,
        //     "value": 14
        // }
        // await axios.post({method: 'POST', url: `${env.RECTI_URL}/set-module-32`, data: body, timeout: 5000})
        //     .then((response) => {
        //         const resp = response.data
        //         const resp_body = {
        //             "status": resp,
        //             "message": "Power Module Rectifier is ON"
        //         }
        //         return resp_body
        //     })
        //     .catch((error) => {
        //         return {code: 500, status: false, message: error}
        //     })
        console.log('power rectifier is on');
    } else {
        console.log('power rectifier is off');
    //     body = {
    //         "group": 0,
    //         "value": 0
    //     }
    //     await axios.post({method: 'POST', url: `${env.RECTI_URL}/set-module-32`, data: body, timeout: 5000})
    //         .then((response) => {
    //             const resp = response.data
    //             const resp_body = {
    //                 "status": resp,
    //                 "message": "Power Module Rectifier is OFF"
    //             }
    //             return resp_body
    //         })
    //         .catch((error) => {
    //             return {code: 500, status: false, message: error}
    //         })
    }
}

const checkTemperature = async () => {
    try {
        const data = await M_frame.findAll({ attributes: ['frame_sn', 'status_test'] })
    
        data.map(async (item, index) => {
            await axios({ method: 'GET', url: `${env.BASE_URL}/get-cms-data`, timeout: 10000 })
                .then((response) => {
                    const resp = response.data.cms_data
                    const rs = resp.map(async (el, idx) => {
                        const frameName = el.frame_name
                        const temperatureCell = el.temp
                        if (item.frame_sn === frameName && item.status_test === true) {
                            temperatureCell.map(async (el, idx) => {
                                if (el >= configCharging.warningTemp && el < configCharging.cutOffTemp) {
                                    console.log(`warning temperature is ${el/1000}`)
                                    return true
                                }
                                if (el >= cutOffTemp) {
                                    console.log(`Temperature is ${el/1000}, cut off charging`)
                                }
                            })
                        }
                    })
                })
                .catch((err) => {
                    console.log(`Update status checking err, ${err}`)
                })
        })
    } 
    catch (error) {
        console.log(`Check temperature err, ${error}`)
    }
}

const setMaxRectifierCurrent = async (init) => {
    if (init) {
        console.log('set rectifier 100A');
        // const currValue = 100
        // await checkTemperature()
        // const body = {
        //     'group': 0,
        //     'subaddress': 0,
        //     'current': currValue
        // }
        // await axios.post({method: 'POST', url: `${env.RECTI_URL}/set-current`, data: body, timeout: 5000})
        //     .then((response) => {
        //         const resp = response.data
        //         const resp_body = {
        //             "status": resp,
        //             "message": `Set max rectifier current to ${currValue}A`
        //         }
        //         return resp_body
        //     })
        //     .catch((error) => {
        //         return {code: 500, status: false, message: error}
        //     })
    } else {
        console.log('set rectifier 0A');
    //     const currValue = 0
    //     const body = {
    //         'group': 0,
    //         'subaddress': 0,
    //         'current': currValue
    //     }
    //     await axios.post({method: 'POST', url: `${env.RECTI_URL}/set-current`, data: body, timeout: 5000})
    //         .then((response) => {
    //             const resp = response.data
    //             const resp_body = {
    //                 "status": resp,
    //                 "message": `Set max rectifier current to ${currValue}A`
    //             }
    //             return resp_body
    //         })
    //         .catch((error) => {
    //             return {code: 500, status: false, message: error}
    //         })
    }
}

const setRectifierCurrent = async (init) => {
    if (init) {
        console.log('set rectifier 30A');
        // const currValue = [30, 40]
        // currValue.map(async (item, index) => {
        //     await checkTemperature()
        //     const body = {
        //         'group': 0,
        //         'subaddress': 0,
        //         'current': item
        //     }
        //     await axios.post({method: 'POST', url: `${env.RECTI_URL}/set-current`, data: body, timeout: 5000})
        //         .then((response) => {
        //             const resp = response.data
        //             const resp_body = {
        //                 "status": resp,
        //                 "message": `Set rectifier current to ${item}A`
        //             }
        //             return resp_body
        //         })
        //         .catch((error) => {
        //             return {code: 500, status: false, message: error}
        //         })
        // })
    } else {
        console.log('set rectifier 0A');
        // const currValue = 0
        // const body = {
        //     'group': 0,
        //     'subaddress': 0,
        //     'current': currValue
        // }
        // await axios.post({method: 'POST', url: `${env.RECTI_URL}/set-current`, data: body, timeout: 5000})
        //     .then((response) => {
        //         const resp = response.data
        //         const resp_body = {
        //             "status": resp,
        //             "message": `Set max rectifier current to ${currValue}A`
        //         }
        //         return resp_body
        //     })
        //     .catch((error) => {
        //         return {code: 500, status: false, message: error}
        //     })
    }
}

const setRectifierVoltage = async (init) => {
    if (init) {
        console.log('set rectifier 3600V');
        // const maxVoltCell = 3600
        // const totalCell = 32
        // const result = maxVoltCell * totalCell

        // const body = {
        //     'group': 0,
        //     'subaddress': 0,
        //     'voltage': result
        // }

        // await axios.post({method: 'POST', url: `${env.RECTI_URL}/set-voltage`, data: body, timeout: 5000})
        //     .then((response) => {
        //         const resp = response.data
        //         const resp_body = {
        //             "status": resp,
        //             "message": `Set rectifier voltage to ${result}V`
        //         }
        //         return resp_body
        //     })
        //     .catch((error) => {
        //         return {code: 500, status: false, message: error}
        //     })
    } else {
        console.log('set rectifier 0V');
        // const body = {
        //     'group': 0,
        //     'subaddress': 0,
        //     'voltage': 0
        // }
        // await axios.post({method: 'POST', url: `${env.RECTI_URL}/set-voltage`, data: body, timeout: 5000})
        //     .then((response) => {
        //         const resp = response.data
        //         const resp_body = {
        //             "status": resp,
        //             "message": `Set rectifier voltage to 0V`
        //         }
        //         return resp_body
        //     })
        //     .catch((error) => {
        //         return {code: 500, status: false, message: error}
        //     })
    }
}

const supplyRectifier = async (init) => {
    if (init) {
        await setRectifierCurrent(true)
        await setRectifierVoltage(true)
    } else {
        await setRectifierCurrent(false)
        await setRectifierVoltage(false)
    }
}

const rectifierMain = async (req, res) => {
    const vcell = req.vcell
    const maxVoltage = []
    vcell.map((el) => {
        if (el > configCharging.maxCellBatt) {
            maxVoltage.push(el)
        }
    })
    const validTime = await validateTime()

    if (validTime) {
        // await supplyRectifier(false)
        // await powerModuleRectifier(false)

        await updateResultStatus()
        await updateStatusTest()
        await updateStatusChecking()
        return res.status(200).json({ code: 200, status: true, msg: 'CHARGING_DONE' })
    } 
    else if (maxVoltage.length > 0) {
        // await supplyRectifier(false)
        // await powerModuleRectifier(false)
        
        await updateResultStatus()
        await updateStatusTest()
        await updateStatusChecking()
        return res.status(200).json({ code: 200, status: true, msg: 'CHARGING_DONE' })
    } else {
        // return {code: 200, status: true, message: 'Charging process is running'}
    }
}

const readVcell = async (data) => {
    const vcell = data.vcell
    const maxVoltage = []
    vcell.map((el) => {
        if (el > configCharging.maxCellBatt) {
            maxVoltage.push(el)
        }
    })
    const rs = await initializeRectifier(maxVoltage)
    return rs
}

const initializeRectifier = async (maxVoltage) => {
    if (maxVoltage.length > 0) {
        return false
    } else {
        console.log('Turn on rectifier')
        await powerModuleRectifier(true)
        await supplyRectifier(true)

        await mainProgram(true)
    }
}

export { powerModuleRectifier, checkTemperature, supplyRectifier, setMaxRectifierCurrent, rectifierMain, readVcell}