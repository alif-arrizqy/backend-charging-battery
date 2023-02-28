import axios from 'axios'
import dotenv from 'dotenv'

const env = dotenv.config().parsed

const powerModuleRectifier = async (req, res) => {
    const init = req.params.init
    if (init === 'true') {
        const body = {
            "group": 0,
            "value": 14
        }
        try {
            await axios({method: 'POST', url: `${env.RECTI_URL}/set-module-32`, data: body, timeout: 5000})
                .then((response) => {
                    return res.status(200).json({ code: 200, status: true, msg: 'POWER_MODULE_RECTIFIER_TURN_ON' })
                })
                .catch((error) => {
                    return res.status(500).json({ code: 500, status: false, msg: error.code })
                })
        } catch (err) {
            return res.status(500).json({ code: 500, status: false, msg: err.code })
        }
    } else {
        const body = {
            "group": 0,
            "value": 0
        }
        await axios({method: 'POST', url: `${env.RECTI_URL}/set-module-32`, data: body, timeout: 5000})
            .then((response) => {
                return res.status(200).json({ code: 200, status: true, msg: 'POWER_MODULE_RECTIFIER_TURN_OFF' })
            })
            .catch((error) => {
                return res.status(500).json({ code: 500, status: false, msg: error.code })
            })
    }
}

const setRectifierCurrent = async (req, res) => {
    const currValue = parseInt(req.body.current)
    
    const body = {
        'group': 0,
        'subaddress': 0,
        'current': currValue*1000
    }
    await axios({method: 'POST', url: `${env.RECTI_URL}/set-current`, data: body, timeout: 5000})
        .then((response) => {
            return res.status(200).json({ code: 200, status: true, msg: `SET_RECTIFIER_CURRENT_TO_${currValue}A` })
        })
        .catch((error) => {
            return res.status(500).json({ code: 500, status: false, msg: error.code })
        })
}

const setRectifierVoltage = async (req, res) => {
    const maxVoltCell = parseInt(req.body.maxVoltage)
    const totalCell = parseInt(req.body.totalCell)
    const result = maxVoltCell * totalCell

    const body = {
        'group': 0,
        'subaddress': 0,
        'voltage': result
    }
    await axios({method: 'POST', url: `${env.RECTI_URL}/set-voltage`, data: body, timeout: 5000})
        .then((response) => {
            return res.status(200).json({ code: 200, status: true, msg: `SET_RECTIFIER_VOLTAGE_TO_${result}V` })
        })
        .catch((error) => {
            return res.status(500).json({ code: 500, status: false, msg: error.code })
        })
}

export { powerModuleRectifier, setRectifierCurrent, setRectifierVoltage }