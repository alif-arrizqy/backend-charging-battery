import axios from "axios";
import dotenv from "dotenv";
import ChgSettingModel from "../models/ChargingSettingModel.js";
import db from "../config/dataBase.js";
const env = dotenv.config().parsed;

const powerModuleRectifier = async (req, res) => {
    const init = req.params.init;
    if (init === "true") {
        const body = {
            group: 0,
            value: 14,
        };
        try {
            await axios({
                method: "POST",
                url: `${env.RECTI_URL}/set-module-32`,
                data: body,
                timeout: 5000,
            })
                .then((response) => {
                    return res.status(200).json({
                        code: 200,
                        status: true,
                        msg: "POWER_MODULE_RECTIFIER_TURN_ON",
                    });
                })
                .catch((error) => {
                    return res
                        .status(500)
                        .json({ code: 500, status: false, msg: error.code });
                });
        } catch (err) {
            return res.status(500).json({ code: 500, status: false, msg: err.code });
        }
    } else {
        const body = {
            group: 0,
            value: 0,
        };
        await axios({
            method: "POST",
            url: `${env.RECTI_URL}/set-module-32`,
            data: body,
            timeout: 5000,
        })
            .then((response) => {
                return res.status(200).json({
                    code: 200,
                    status: true,
                    msg: "POWER_MODULE_RECTIFIER_TURN_OFF",
                });
            })
            .catch((error) => {
                return res
                    .status(500)
                    .json({ code: 500, status: false, msg: error.code });
            });
    }
};

const getSetting = async (req, res) => {
    try {
        const response = await ChgSettingModel.findAll({ 
            attributes: ["max_voltage_cell", "total_cell", "recti_voltage", "recti_current"],
            logging: false });
        response.map((item) => { 
            return res.status(200).json({
                code: 200,
                status: true,
                msg: {
                    max_voltage_cell: item.max_voltage_cell,
                    total_cell: item.total_cell,
                    recti_voltage: item.recti_voltage,
                    recti_current: item.recti_current,
                }
            })
        });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ code: 500, status: false, msg: error.message });
    }
};

const setRectifierCurrent = async (req, res) => {
    const currValue = parseInt(req.body.current);

    try {
        const data = await ChgSettingModel.findAll({
            attributes: ["recti_current"],
            logging: false,
        });

        data.map(async (item) => {
            const rectiCurrent = item.recti_current;

            if (isNaN(currValue)) {
                // request api
                const body = {
                    group: 0,
                    subaddress: 0,
                    current: rectiCurrent * 1000,
                };
                return res.status(200).json({
                    code: 200,
                    status: true,
                    msg: `SET_RECTIFIER_CURRENT_TO_${rectiCurrent}A`,
                });
                // await axios({method: 'POST', url: `${env.RECTI_URL}/set-current`, data: body, timeout: 5000})
                // .then((response) => {
                //         return res.status(200).json({ code: 200, status: true, msg: `SET_RECTIFIER_CURRENT_TO_${rectiCurrent}A` })
                //     })
                //     .catch((error) => {
                //         return res.status(500).json({ code: 500, status: false, msg: error.code })
                //     })
            }
            if (rectiCurrent !== currValue) {
                // update new value to database
                const sql = `UPDATE charging_setting SET recti_current = ${currValue}`;
                await db.query(sql, { type: db.QueryTypes.UPDATE, logging: false });

                // request api
                const body = {
                    group: 0,
                    subaddress: 0,
                    current: currValue * 1000,
                };
                return res.status(200).json({
                    code: 200,
                    status: true,
                    msg: `SET_RECTIFIER_NEW_CURRENT_TO_${currValue}A`,
                });
                // await axios({method: 'POST', url: `${env.RECTI_URL}/set-current`, data: body, timeout: 5000})
                // .then((response) => {
                //         return res.status(200).json({ code: 200, status: true, msg: `SET_RECTIFIER_NEW_CURRENT_TO_${currValue}A` })
                //     })
                //     .catch((error) => {
                //         return res.status(500).json({ code: 500, status: false, msg: error.code })
                //     })
            } else {
                // request api
                return res.status(200).json({
                    code: 200,
                    status: true,
                    msg: `SET_RECTIFIER_CURRENT_TO_${rectiCurrent}A`,
                });
                // const body = {
                //     'group': 0,
                //     'subaddress': 0,
                //     'current': rectiCurrent*1000
                // }
                // await axios({method: 'POST', url: `${env.RECTI_URL}/set-current`, data: body, timeout: 5000})
                //     .then((response) => {
                //         return res.status(200).json({ code: 200, status: true, msg: `SET_RECTIFIER_CURRENT_TO_${rectiCurrent}A` })
                //     })
                //     .catch((error) => {
                //         return res.status(500).json({ code: 500, status: false, msg: error.code })
                //     })
            }
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ code: 500, status: false, msg: err.code });
    }
};

const setRectifierVoltage = async (req, res) => {
    const maxVoltCell = parseInt(req.body.maxVoltage);
    const totalCell = parseInt(req.body.totalCell);
    const resultVoltage = maxVoltCell * totalCell;

    try {
        const data = await ChgSettingModel.findAll({
            attributes: ["max_voltage_cell", "total_cell", "recti_voltage"],
            logging: false,
        });

        data.map(async (item) => {
            const rectiVoltage = item.recti_voltage;
            const maxVolt = item.max_voltage_cell;
            const total = item.total_cell;

            if (isNaN(resultVoltage)) {
                return res.status(200).json({
                    code: 200,
                    status: true,
                    msg: `SET_RECTIFIER_VOLTAGE_TO_${rectiVoltage}V`,
                });
                // const body = {
                //     'group': 0,
                //     'subaddress': 0,
                //     'voltage': rectiVoltage
                // }
                // await axios({ method: 'POST', url: `${env.RECTI_URL}/set-voltage`, data: body, timeout: 5000 })
                //     .then((response) => {
                //         return res.status(200).json({ code: 200, status: true, msg: `SET_RECTIFIER_VOLTAGE_TO_${rectiVoltage}V` })
                //     })
                //     .catch((error) => {
                //         return res.status(500).json({ code: 500, status: false, msg: error.code })
                //     })
            }
            if (rectiVoltage !== resultVoltage) {
                // / update new value to database
                const sql = `UPDATE charging_setting SET recti_voltage = ${resultVoltage}, max_voltage_cell = ${maxVoltCell}, total_cell = ${totalCell}`;
                await db.query(sql, { type: db.QueryTypes.UPDATE, logging: false });

                // request api
                return res.status(200).json({
                    code: 200,
                    status: true,
                    msg: `SET_RECTIFIER_NEW_VOLTAGE_TO_${resultVoltage}V`,
                });
                // const body = {
                //     'group': 0,
                //     'subaddress': 0,
                //     'voltage': resultVoltage
                // }
                // await axios({ method: 'POST', url: `${env.RECTI_URL}/set-voltage`, data: body, timeout: 5000 })
                //     .then((response) => {
                //         return res.status(200).json({ code: 200, status: true, msg: `SET_RECTIFIER_NEW_VOLTAGE_TO_${resultVoltage}V` })
                //     })
                //     .catch((error) => {
                //         return res.status(500).json({ code: 500, status: false, msg: error.code })
                //     })
            }
            else {
                return res.status(200).json({
                    code: 200,
                    status: true,
                    msg: `SET_RECTIFIER_VOLTAGE_TO_${rectiVoltage}V`,
                });
                // const body = {
                //     'group': 0,
                //     'subaddress': 0,
                //     'voltage': rectiVoltage
                // }
                // await axios({ method: 'POST', url: `${env.RECTI_URL}/set-voltage`, data: body, timeout: 5000 })
                //     .then((response) => {
                //         return res.status(200).json({ code: 200, status: true, msg: `SET_RECTIFIER_VOLTAGE_TO_${rectiVoltage}V` })
                //     })
                //     .catch((error) => {
                //         return res.status(500).json({ code: 500, status: false, msg: error.code })
                //     })
            }
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ code: 500, status: false, msg: err.code });
    }
};

export { powerModuleRectifier, setRectifierCurrent, setRectifierVoltage, getSetting };
