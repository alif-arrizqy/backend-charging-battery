import axios from 'axios'
import dotenv from 'dotenv'
import configCharging from '../config/configCharging.js'

const env = dotenv.config().parsed

const powerModuleRectifier = async (req, res) => {
    const init = req.params.init
    console.log(init);
    if (init === 1) {
        body = {
            "group": 0,
            "value": 14
        }
        try {
            await axios.post({method: 'POST', url: `${env.RECTI_URL}/set-module-32`, data: body, timeout: 5000})
                .then((response) => {
                    return res.status(200).json({ code: 200, status: true, message: 'POWER_MODULE_RECTIFIER_TURN_ON' })
                })
                .catch((error) => {
                    return res.status(500).json({ code: 500, status: false, message: error })
                })
        } catch (err) {
            return res.status(500).json({ code: 500, status: false, message: err.message })
        }
    } else {
        body = {
            "group": 0,
            "value": 0
        }
        await axios.post({method: 'POST', url: `${env.RECTI_URL}/set-module-32`, data: body, timeout: 5000})
            .then((response) => {
                return res.status(200).json({ code: 200, status: true, message: 'POWER_MODULE_RECTIFIER_TURN_OFF' })
            })
            .catch((error) => {
                return res.status(500).json({ code: 500, status: false, message: error })
            })
    }
}



const setMaxRectifierCurrent = async (req, res) => {
    if (req) {
        const currValue = 100
        const body = {
            'group': 0,
            'subaddress': 0,
            'current': currValue
        }
        await axios.post({method: 'POST', url: `${env.RECTI_URL}/set-current`, data: body, timeout: 5000})
            .then((response) => {
                return res.status(200).json({ code: 200, status: true, message: `SET_RECTIFIER_CURRENT_TO_${currValue}A` })
            })
            .catch((error) => {
                return res.status(500).json({ code: 500, status: false, message: error })
            })
    } else {
        const currValue = 0
        const body = {
            'group': 0,
            'subaddress': 0,
            'current': currValue
        }
        await axios.post({method: 'POST', url: `${env.RECTI_URL}/set-current`, data: body, timeout: 5000})
            .then((response) => {
                return res.status(200).json({ code: 200, status: true, message: `SET_RECTIFIER_CURRENT_TO_0A` })
            })
            .catch((error) => {
                return res.status(500).json({ code: 500, status: false, message: error })
            })
    }
}

const setRectifierCurrent = async (req, res) => {
    if (req) {
        const currValue = [30, 40]
        currValue.map(async (item, index) => {
            const body = {
                'group': 0,
                'subaddress': 0,
                'current': item
            }
            await axios.post({method: 'POST', url: `${env.RECTI_URL}/set-current`, data: body, timeout: 5000})
                .then((response) => {
                    return res.status(200).json({ code: 200, status: true, message: `SET_RECTIFIER_CURRENT_TO_${item}A` })
                })
                .catch((error) => {
                    return res.status(500).json({ code: 500, status: false, message: error })
                })
        })
    } else {
        const currValue = 0
        const body = {
            'group': 0,
            'subaddress': 0,
            'current': currValue
        }
        await axios.post({method: 'POST', url: `${env.RECTI_URL}/set-current`, data: body, timeout: 5000})
            .then((response) => {
                return res.status(200).json({ code: 200, status: true, message: `SET_RECTIFIER_CURRENT_TO_0A` })
            })
            .catch((error) => {
                return res.status(500).json({ code: 500, status: false, message: error })
            })
    }
}

const setRectifierVoltage = async (req, res) => {
    if (req) {
        const maxVoltCell = 3600
        const totalCell = 32
        const result = maxVoltCell * totalCell

        const body = {
            'group': 0,
            'subaddress': 0,
            'voltage': result
        }

        await axios.post({method: 'POST', url: `${env.RECTI_URL}/set-voltage`, data: body, timeout: 5000})
            .then((response) => {
                return res.status(200).json({ code: 200, status: true, message: `SET_RECTIFIER_VOLTAGE_TO_${result}V` })
            })
            .catch((error) => {
                return res.status(500).json({ code: 500, status: false, message: error })
            })
    } else {
        const body = {
            'group': 0,
            'subaddress': 0,
            'voltage': 0
        }
        await axios.post({method: 'POST', url: `${env.RECTI_URL}/set-voltage`, data: body, timeout: 5000})
            .then((response) => {
                return res.status(200).json({ code: 200, status: true, message: `SET_RECTIFIER_VOLTAGE_TO_0V` })
            })
            .catch((error) => {
                return res.status(500).json({ code: 500, status: false, message: error })
            })
    }
}

export { powerModuleRectifier, setMaxRectifierCurrent, setRectifierCurrent, setRectifierVoltage }