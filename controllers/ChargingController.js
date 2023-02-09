import axios from 'axios'
import dotenv from 'dotenv'
import moment from 'moment'
import realtime from '../models/RealTimeModel.js'
import M_frame from '../models/M_frameModel.js'
import db from '../config/dataBase.js'
import configCharging from '../config/configCharging.js'
import { rectifierMain, readVcell, supplyRectifier, powerModuleRectifier } from './RectifierController.js'
const env = dotenv.config().parsed

const clearRealtimeTable = async (req, res) => {
    try {
        const del = await realtime.destroy({ truncate: true })

        if(!del) { throw {code: 500, message: 'CLEAR_TABLE_FAILED' } }

        return res.status(200).json({
            status: true,
            message: 'CLEAR_REALTIME_TABLE_SUCCESS'
        })
    } catch (err) {
        return res.status(500).json({
            status: false,
            message: err.message
        })
    }
}

const cmsData = async (req, res) => {
    try {
        console.log('get cms data')
        const data = await M_frame.findAll({ attributes: ['frame_sn', 'status_test'], logging: false })

        data.map(async (item, index) => {
            await axios({ method: 'GET', url: `${env.BASE_URL}/get-cms-data`, timeout: 10000 })
                .then((response) => {
                    const resp = response.data.cms_data
                    const rs = resp.map(async (el, idx) => {
                        const frameName = el.frame_name
                        if (item.frame_sn === frameName && item.status_test === true) {
                            const vcell = el.vcell
                            const getDiffVCell = await differentVoltageCell(vcell)
                            console.log(`Processing frame: ${frameName}`);
                            // insert data to table
                            // await insertData(el, getDiffVCell)

                            // check diffence vcell
                            const resultDVC = await checkMaxDVC(getDiffVCell)
                            

                            // await rectifierData()
                            // await rectifierMain(el)
                        }
                    })
                })
                .catch((err) => {
                    console.log(`error get cms data ${err}`)
                })
        })
    } catch (err) {
        console.log(err)
    }
}

const insertData = async (frameData, dvc) => {
    const frameSN = `${frameData.frame_name}`
    const diffVCell = JSON.stringify(dvc)
    try {
        const sql = `
            INSERT INTO ${frameSN} (frame_sn, bid, v1, v2, v3, v4, v5, v6,
            v7, v8, v9, v10, v11, v12, v13, v14, v15, v16, v17, v18, v19,
            v20, v21, v22, v23, v24, v25, v26, v27, v28, v29, v30, v31,
            v32, v33, v34, v35, v36, v37, v38, v39, v40, v41, v42, v43, v44,
            v45, t1, t2, t3, t4, t5, t6, t7, t8, t9, vp1, vp2, vp3, wake_status, diff_vcell)
            VALUES ('${frameSN}', '${frameData.bid}', '${frameData.vcell[0]}', '${frameData.vcell[1]}', '${frameData.vcell[2]}', '${frameData.vcell[3]}', '${frameData.vcell[4]}', '${frameData.vcell[5]}',
            '${frameData.vcell[6]}', '${frameData.vcell[7]}', '${frameData.vcell[8]}', '${frameData.vcell[9]}', '${frameData.vcell[10]}', '${frameData.vcell[11]}', '${frameData.vcell[12]}',
            '${frameData.vcell[13]}', '${frameData.vcell[14]}', '${frameData.vcell[15]}', '${frameData.vcell[16]}', '${frameData.vcell[17]}', '${frameData.vcell[18]}',
            '${frameData.vcell[19]}', '${frameData.vcell[20]}', '${frameData.vcell[21]}', '${frameData.vcell[22]}', '${frameData.vcell[23]}', '${frameData.vcell[24]}',
            '${frameData.vcell[25]}', '${frameData.vcell[26]}', '${frameData.vcell[27]}', '${frameData.vcell[28]}', '${frameData.vcell[29]}', '${frameData.vcell[30]}',
            '${frameData.vcell[31]}', '${frameData.vcell[32]}', '${frameData.vcell[33]}', '${frameData.vcell[34]}', '${frameData.vcell[35]}', '${frameData.vcell[36]}',
            '${frameData.vcell[37]}', '${frameData.vcell[38]}', '${frameData.vcell[39]}', '${frameData.vcell[40]}', '${frameData.vcell[41]}', '${frameData.vcell[42]}',
            '${frameData.vcell[43]}', '${frameData.vcell[44]}', '${frameData.temp[0]}', '${frameData.temp[1]}', '${frameData.temp[2]}',
            '${frameData.temp[3]}', '${frameData.temp[4]}', '${frameData.temp[5]}', '${frameData.temp[6]}', '${frameData.temp[7]}', '${frameData.temp[8]}',
            '${frameData.pack[0]}', '${frameData.pack[1]}', '${frameData.pack[2]}', '${frameData.wake_status}', '${diffVCell}')
        `
        await db.query(sql, { type: db.QueryTypes.INSERT, logging: false })
        console.log(`insert data into table ${frameSN} success`)

        const sql_realtime = `
            INSERT INTO realtime (frame_sn, bid, v1, v2, v3, v4, v5, v6,
            v7, v8, v9, v10, v11, v12, v13, v14, v15, v16, v17, v18, v19,
            v20, v21, v22, v23, v24, v25, v26, v27, v28, v29, v30, v31,
            v32, v33, v34, v35, v36, v37, v38, v39, v40, v41, v42, v43, v44,
            v45, t1, t2, t3, t4, t5, t6, t7, t8, t9, vp1, vp2, vp3, wake_status, diff_vcell)
            VALUES ('${frameSN}', '${frameData.bid}', '${frameData.vcell[0]}', '${frameData.vcell[1]}', '${frameData.vcell[2]}', '${frameData.vcell[3]}', '${frameData.vcell[4]}', '${frameData.vcell[5]}',
            '${frameData.vcell[6]}', '${frameData.vcell[7]}', '${frameData.vcell[8]}', '${frameData.vcell[9]}', '${frameData.vcell[10]}', '${frameData.vcell[11]}', '${frameData.vcell[12]}',
            '${frameData.vcell[13]}', '${frameData.vcell[14]}', '${frameData.vcell[15]}', '${frameData.vcell[16]}', '${frameData.vcell[17]}', '${frameData.vcell[18]}',
            '${frameData.vcell[19]}', '${frameData.vcell[20]}', '${frameData.vcell[21]}', '${frameData.vcell[22]}', '${frameData.vcell[23]}', '${frameData.vcell[24]}',
            '${frameData.vcell[25]}', '${frameData.vcell[26]}', '${frameData.vcell[27]}', '${frameData.vcell[28]}', '${frameData.vcell[29]}', '${frameData.vcell[30]}',
            '${frameData.vcell[31]}', '${frameData.vcell[32]}', '${frameData.vcell[33]}', '${frameData.vcell[34]}', '${frameData.vcell[35]}', '${frameData.vcell[36]}',
            '${frameData.vcell[37]}', '${frameData.vcell[38]}', '${frameData.vcell[39]}', '${frameData.vcell[40]}', '${frameData.vcell[41]}', '${frameData.vcell[42]}',
            '${frameData.vcell[43]}', '${frameData.vcell[44]}', '${frameData.temp[0]}', '${frameData.temp[1]}', '${frameData.temp[2]}',
            '${frameData.temp[3]}', '${frameData.temp[4]}', '${frameData.temp[5]}', '${frameData.temp[6]}', '${frameData.temp[7]}', '${frameData.temp[8]}',
            '${frameData.pack[0]}', '${frameData.pack[1]}', '${frameData.pack[2]}', '${frameData.wake_status}', '${diffVCell}')
        `
        await db.query(sql_realtime, { type: db.QueryTypes.INSERT, logging: false})
        console.log(`insert data into table realtime success`)

        return true
    } 
    catch (err) {
        return false
    }
}

const differentVoltageCell = async (req, res) => {
    const poppop = [3, 7, 8, 12, 13, 18, 22, 23, 27, 28, 33, 38, 43]

    const newVCell = req.filter((el, index) => !poppop.includes(index))
    const minCell = Math.min(...newVCell)
    const newData = newVCell.map((el) => el - minCell)

    const tempDiff = {}
    newData.map((el, index) => {
        tempDiff[`D${index+1}`] = el
    })
    const arrVcell = []
    Object.values(tempDiff).map((el, index) => {
        const tempObj = {
            [`D${index+1}`]: el
        }
        arrVcell.push(tempObj)
    })
    const diffVCell = {
        "diff_vcell": arrVcell
    }
    return diffVCell
}

const checkMaxDVC = async (req, res) => {
    // check diffence vcell
    const arrVCell = []
    req.diff_vcell.map((item, index) => {
        Object.values(item).map((el, idx) => {
            arrVCell.push(el)
        })
    })
    const maxVCell = Math.max(...arrVCell)
    const setMaxCell = configCharging.setmaxVCell
    return maxVCell > setMaxCell ? true : false
}

const rectifierData = async () => {
    const rectiUrl = env.RECTI_URL
    const rectiId = [1,2,3]
    try {
        const rectiIds = rectiId.map(async (id) => {
            const body = {
                "group": 0,
                "subaddress": id
            }
            await axios.post({method: 'POST', url: `${rectiUrl}/get-data-charger`, data: body, timeout: 10000})
            .then(async (res) => {
                const resp = res.data
                const module_off = resp.module_off
                const voltage = resp.voltage
                const current = resp.current
                console.log('Processing rectifier data')

                const sql = `
                    INSERT INTO rectifier_logger_${id} (module_off, voltage, current)
                    VALUES ('${module_off}', '${voltage}', '${current}')
                `
                await db.query(sql, {type: db.QueryTypes.INSERT})
                console.log(`insert data into table rectifier_logger_${id} success`);
            })
            .catch((err) => {
                console.log(err)
            })
        })
    } catch (err) {
        return {code: 500, status:false, message: 'GET_RECTIFIER_DATA_FAILED'}
    }
}

const checkStatus = async (req, res) => {
    console.log('Checking status');
    try {
        const data = await M_frame.findAll({ attributes: ['frame_sn', 'status_test'], logging: false })

        data.map(async (item, index) => {
            await axios({ method: 'GET', url: `${env.BASE_URL}/get-cms-data`, timeout: 10000 })
                .then((response) => {
                    const resp = response.data.cms_data
                    const rs = resp.map(async (el, idx) => {
                        const frameName = el.frame_name
                        if (item.frame_sn === frameName && item.status_test === true) {
                            const vCell = el.vcell
                            const getDiffVCell = await differentVoltageCell(vCell)
                            console.log(`Processing frame: ${frameName}`);
                            // insert data to table
                            // await insertData(el, getDiffVCell)

                            // check vcell
                            await readVcell(el)
                            res.status(500).json({ code: 500, status: false, msg: 'Battery cell is 3.6, not allowed to charge' })
                        }
                    })
                })
                .catch((err) => {
                    console.log(`error get cms data ${err}`)
                })
            })
    } catch (err) {
        console.log(err)
    }
    // await checkStatus()
}

const updateResultStatus = async () => {
    try {
        const data = await M_frame.findAll({ attributes: ['frame_sn'], logging: false })

        data.map(async (item, index) => {
            await axios({ method: 'GET', url: `${env.BASE_URL}/get-cms-data`, timeout: 10000 })
                .then((response) => {
                    const resp = response.data.cms_data
                    const rs = resp.map(async (el, idx) => {
                        const frameName = el.frame_name
                        if (item.frame_sn === frameName) {
                            const vCell = el.vcell
                            const getDiffVCell = await differentVoltageCell(vCell)

                            // const arrVCell = []
                            // getDiffVCell.diff_vcell.map((item, index) => {
                            //     Object.values(item).map((el, idx) => {
                            //         arrVCell.push(el)
                            //     })
                            // })
                            // const maxVCell = Math.max(...arrVCell)
                            // const setMaxCell = configCharging.setmaxVCell
                            // if (maxVCell > setMaxCell) {
                            //     console.log('RESULT CHARGING FAIL')
                            //     const sql = `UPDATE m_frame SET result = 'fail' WHERE frame_sn = '${frameName}'`
                            //     await db.query(sql, {type: db.QueryTypes.UPDATE, logging: false})
                            // } else {
                            //     console.log('RESULT CHARGING PASS')
                            //     const sql = `UPDATE m_frame SET result = 'pass' WHERE frame_sn = '${frameName}'`
                            //     await db.query(sql, {type: db.QueryTypes.UPDATE, logging: false})
                            // }
                            const resultDVC = await checkMaxDVC(getDiffVCell)
                            if (resultDVC) {
                                console.log('RESULT CHARGING FAIL')
                                const sql = `UPDATE m_frame SET result = 'fail' WHERE frame_sn = '${frameName}'`
                                await db.query(sql, {type: db.QueryTypes.UPDATE, logging: false})
                            } else {
                                console.log('RESULT CHARGING PASS')
                                const sql = `UPDATE m_frame SET result = 'pass' WHERE frame_sn = '${frameName}'`
                                await db.query(sql, {type: db.QueryTypes.UPDATE, logging: false})
                            }
                        }
                    })
                })
                .catch((err) => {
                    console.log(`Update status result err, ${err}`)
                })
        })
    } catch (err) {
        console.log('Update status test Failed')
    } finally {
        console.log('Update status test Done')
    }
}

const updateStatusTest = async () => {
    try {
        const data = await M_frame.findAll({ attributes: ['frame_sn', 'status_test'], logging: false })
    
        data.map(async (item, index) => {
            await axios({ method: 'GET', url: `${env.BASE_URL}/get-cms-data`, timeout: 10000 })
                .then((response) => {
                    const resp = response.data.cms_data
                    const rs = resp.map(async (el, idx) => {
                        const frameName = el.frame_name
                        if (item.frame_sn === frameName && item.status_test === true) {
                            const sql = `UPDATE m_frame SET status_test = false WHERE frame_sn = '${frameName}'`
                            await db.query(sql, {type: db.QueryTypes.UPDATE, logging: false})
                        }
                    })
                })
                .catch((err) => {
                    console.log(`Update status test err, ${err}`)
                })
        })
    } catch (err) {
        console.log('Update status test Failed')
    } finally {
        console.log('Update status test Done')
    }
    
}

const updateStatusChecking = async () => {
    try {
        const data = await M_frame.findAll({ attributes: ['frame_sn', 'status_checking'], logging: false })
    
        data.map(async (item, index) => {
            await axios({ method: 'GET', url: `${env.BASE_URL}/get-cms-data`, timeout: 10000 })
                .then((response) => {
                    const resp = response.data.cms_data
                    const rs = resp.map(async (el, idx) => {
                        const frameName = el.frame_name
                        if (item.frame_sn === frameName && item.status_checking === false) {
                            const sql = `UPDATE m_frame SET status_checking = true WHERE frame_sn = '${frameName}'`
                            await db.query(sql, {type: db.QueryTypes.UPDATE, logging: false})
                        }
                    })
                })
                .catch((err) => {
                    console.log(`Update status checking err, ${err}`)
                })
        })
    } catch (err) {
        console.log('Update status checking Failed')
    } finally {
        console.log('Update status checking Done')
    }

    // const validTime = await validateTime()
    // if (validTime) {
    //     await checkStatus()
    // } else {
    //     await mainProgram(false)
    // }
    validateTime() ? await checkStatus() : await mainProgram(false)
}

const validateTime = async () => {
    const now = moment().format('HH:mm')
    const death = '16:58'
    return now > death ? true : false
}

const mainProgram = async (req, res) => {
    if (req) {
        console.log('CHARGING PROGRAM STARTED');
        while (true) {
            await cmsData()
            const validTime = await validateTime()
            if (validTime) {
                console.log('Jam Sudah Lewat')
                await supplyRectifier(false)
                await powerModuleRectifier(false)

                await updateStatusTest()
                await updateResultStatus()
                await updateStatusChecking()
                res.status(500).json({ code: 500, status: false, message: 'TIME_IS_OVER_CHARGING_STOPPED' })
            }
        } 
    } else {
        console.log('CHARGING PROGRAM STOPPED')
        res.status(200).json({ code: 200, status: true, message: 'CHARGING_STOPPED' })
    }
}

const shutdownCharging = async () => {
    await supplyRectifier(false)
    await powerModuleRectifier(false)

    await mainProgram(false)
}

export { checkStatus, shutdownCharging, mainProgram, updateStatusTest, updateResultStatus, updateStatusChecking, validateTime, checkMaxDVC }