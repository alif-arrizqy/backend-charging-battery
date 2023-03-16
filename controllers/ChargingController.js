import axios from "axios";
import dotenv from "dotenv";
import moment from "moment";
import realtime from "../models/RealTimeModel.js";
import M_frame from "../models/M_frameModel.js";
import ChgSettingModel from "../models/ChargingSettingModel.js";
import db from "../config/dataBase.js";
import configCharging from "../config/configCharging.js";
const env = dotenv.config().parsed;

const clearRealtimeTable = async (req, res) => {
  try {
    const del = await realtime.destroy({ truncate: true });
    if (!del) {
      return res.status(500).json({ code: 500, message: "CLEAR_TABLE_FAILED" });
    }

    return res
      .status(200)
      .json({ CODE: 200, status: true, msg: "CLEAR_REALTIME_TABLE_SUCCESS" });
  } catch (err) {
    return res.status(500).json({ code: 500, status: false, msg: err.message });
  }
};

const cmsData = async (req, res) => {
  try {
    console.log("get cms data");
    const data = await M_frame.findAll({
      where: {
        frame_sn: req.body.frame_sn,
      },
      attributes: ["frame_sn", "status_test"],
      logging: false,
    });

    if (data.length > 0) {
      data.map(async (item, index) => {
        await axios({
          method: "GET",
          url: `${env.BASE_URL}/get-cms-data`,
          timeout: 50000,
        })
          .then((response) => {
            const store = [];
            const storeBID = [];
            const resp = response.data.cms_data;

            // map response data
            resp.map(async (el, idx) => {
              if (el.bid > 0) {
                storeBID.push(el);
              }
            });

            // map bid
            if (storeBID.length > 0) {
              storeBID.map(async (el, idx) => {
                if (
                  item.frame_sn === el.frame_name &&
                  item.status_test === true
                ) {
                  store.push(el);
                }
              });
            } else {
              return res
                .status(404)
                .json({ code: 404, status: false, msg: "BID_NOT_FOUND" });
            }

            // map store data
            if (store.length > 0) {
              store.map(async (el, idx) => {
                const frameName = el.frame_name;
                const vcell = el.vcell;
                const getDiffVCell = await differentVoltageCell(vcell);
                console.log(`Processing frame: ${frameName}`);

                // insert data to table
                await insertData(el, getDiffVCell);

                // check diffence vcell
                const resultDVC = await checkMaxDVC(getDiffVCell);
                resultDVC
                  ? res.status(500).json({
                      code: 500,
                      status: false,
                      msg: "DIFFERENT_VOLTAGE_CELL_TOO_HIGH",
                    })
                  : res.status(200).json({
                      code: 200,
                      status: true,
                      msg: "DIFFERENT_VOLTAGE_CELL_OK",
                    });
              });
            } else {
              return res.status(404).json({
                code: 404,
                status: false,
                msg: "PLEASE_CHECK_FRAME_NAME_AND_STATUS_TEST",
              });
            }
          })
          .catch((err) => {
            console.log(`error get cms data ${err}`);
            if (err.code) {
              err.code = 500;
            }
            return res
              .status(500)
              .json({ code: 500, status: false, msg: err.message });
          });
      });
    } else {
      return res
        .status(404)
        .json({ code: 404, status: false, msg: "FRAME_NOT_FOUND_IN_MFRAME" });
    }
  } catch (err) {
    if (err.code) {
      err.code = 500;
    }
    return res.status(500).json({ code: 500, status: false, msg: err.message });
  }
};

const totalBatteryVoltage = async (req, res) => {
  try {
    console.log("Total Battery Voltage");
    const data = await M_frame.findAll({
      where: {
        frame_sn: req.body.frame_sn,
      },
      attributes: ["frame_sn", "status_test"],
      logging: false,
    });

    if (data.length > 0) {
      data.map(async (item, index) => {
        await axios({
          method: "GET",
          url: `${env.BASE_URL}/get-cms-data`,
          timeout: 50000,
        })
          .then((response) => {
            const store = [];
            const storeBID = [];
            const resp = response.data.cms_data;

            // map response data
            resp.map(async (el, idx) => {
              if (el.bid > 0) {
                storeBID.push(el);
              }
            });

            // map bid
            if (storeBID.length > 0) {
              storeBID.map(async (el, idx) => {
                if (item.frame_sn === el.frame_name) {
                  store.push(el);
                }
              });
            } else {
              return res
                .status(404)
                .json({ code: 404, status: false, msg: "BID_NOT_FOUND" });
            }

            // map store data
            if (store.length > 0) {
              store.map(async (el, idx) => {
                const frameName = el.frame_name;
                const pack = el.pack;
                console.log(`Processing frame: ${frameName}`);

                // get min and max voltage from database
                const dataVoltage = await ChgSettingModel.findAll({
                  attributes: [
                    "max_voltage_cell",
                    "min_voltage_cell",
                    "total_cell",
                    "recti_voltage",
                    "recti_current",
                  ],
                  logging: false,
                });
                if (dataVoltage.length === 0) {
                  return res.status(404).json({
                    code: 404,
                    status: false,
                    msg: "SETTING_NOT_FOUND",
                  });
                } else {
                  dataVoltage.map((item) => {
                    console.log(item);
                    const maxVolt = item.max_voltage_cell * item.total_cell;
                    const minVolt = item.min_voltage_cell * item.total_cell;
                    // sum total battery voltage
                    const initialValue = 0;
                    const sumPack = pack.reduce(
                      (accumulator, currentValue) => accumulator + currentValue,
                      initialValue
                    );

                    const totalBattVoltage = Math.round(
                      ((sumPack - minVolt) / (maxVolt - minVolt)) * 100
                    );
                    return res.status(200).json({
                      code: 200,
                      status: true,
                      msg: totalBattVoltage,
                    });
                  });
                }
              });
            } else {
              return res.status(404).json({
                code: 404,
                status: false,
                msg: "PLEASE_CHECK_FRAME_NAME_AND_STATUS_TEST",
              });
            }
          })
          .catch((err) => {
            console.log(`error get cms data ${err}`);
            if (err.code) {
              err.code = 500;
            }
            return res
              .status(500)
              .json({ code: 500, status: false, msg: err.message });
          });
      });
    } else {
      return res
        .status(404)
        .json({ code: 404, status: false, msg: "FRAME_NOT_FOUND_IN_MFRAME" });
    }
  } catch (err) {
    if (err.code) {
      err.code = 500;
    }
    return res.status(500).json({ code: 500, status: false, msg: err.message });
  }
};

const checkTemperature = async (req, res) => {
  try {
    const data = await M_frame.findAll({
      where: {
        frame_sn: req.body.frame_sn,
      },
      attributes: ["frame_sn", "status_test"],
      logging: false,
    });

    if (data.length > 0) {
      data.map(async (item, index) => {
        await axios({
          method: "GET",
          url: `${env.BASE_URL}/get-cms-data`,
          timeout: 50000,
        })
          .then((response) => {
            const store = [];
            const storeBID = [];
            const resp = response.data.cms_data;

            // map response data
            resp.map(async (el, idx) => {
              if (el.bid > 0) {
                storeBID.push(el);
              }
            });

            // map bid
            if (storeBID.length > 0) {
              storeBID.map(async (el, idx) => {
                if (
                  item.frame_sn === el.frame_name &&
                  item.status_test === true
                ) {
                  store.push(el);
                }
              });
            } else {
              return res
                .status(404)
                .json({ code: 404, status: false, msg: "BID_NOT_FOUND" });
            }

            // map store data
            if (store.length > 0) {
              store.map(async (el, idx) => {
                const frameName = el.frame_name;
                const temperatureCell = el.temp;
                const highTemperature = [];
                temperatureCell.map(async (elm, idx) => {
                  if (elm >= configCharging.cutOffTemp) {
                    highTemperature.push(elm);
                  }
                });
                if (highTemperature.length > 0) {
                  console.log(
                    `Frame ${frameName} Temperature is ${
                      highTemperature[0] / 1000
                    }, cut off charging`
                  );
                  return res.status(500).json({
                    code: 500,
                    status: false,
                    msg: "TEMPERATURE_TOO_HIGH_CUT_OFF_CHARGING",
                  });
                } else {
                  console.log(`Frame ${frameName} Temperature is ok`);
                  return res.status(200).json({
                    code: 200,
                    status: true,
                    msg: "TEMPERATURE_OK",
                  });
                }
              });
            } else {
              return res.status(404).json({
                code: 404,
                status: false,
                msg: "PLEASE_CHECK_FRAME_NAME_AND_STATUS_TEST",
              });
            }
          })
          .catch((err) => {
            console.log(`error get cms data ${err}`);
            if (err.code) {
              err.code = 500;
            }
            return res
              .status(500)
              .json({ code: 500, status: false, msg: err.message });
          });
      });
    } else {
      return res
        .status(404)
        .json({ code: 404, status: false, msg: "FRAME_NOT_FOUND_IN_MFRAME" });
    }
  } catch (err) {
    console.log(`Check temperature err, ${err}`);
    if (err.code) {
      err.code = 500;
    }
    return res.status(500).json({ code: 500, status: false, msg: err.message });
  }
};

const insertData = async (frameData, dvc) => {
  const frameSN = `${frameData.frame_name}`;
  const diffVCell = JSON.stringify(dvc);
  try {
    const sql = `
            INSERT INTO "${frameSN}" (frame_sn, bid, v1, v2, v3, v4, v5, v6,
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
        `;
    await db.query(sql, { type: db.QueryTypes.INSERT, logging: false });
    console.log(`insert data into table ${frameSN} success`);

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
        `;
    await db.query(sql_realtime, {
      type: db.QueryTypes.INSERT,
      logging: false,
    });
    console.log(`insert data into table realtime success`);
  } catch (err) {
    console.log(`insert data into table ${frameSN} failed, error: ${err}`);
  }
};

const differentVoltageCell = async (req, res) => {
  const poppop = [3, 7, 8, 12, 13, 18, 22, 23, 27, 28, 33, 38, 43];

  const newVCell = req.filter((el, index) => !poppop.includes(index));
  const minCell = Math.min(...newVCell);
  const newData = newVCell.map((el) => el - minCell);

  const tempDiff = {};
  newData.map((el, index) => {
    tempDiff[`D${index + 1}`] = el;
  });
  const arrVcell = [];
  Object.values(tempDiff).map((el, index) => {
    const tempObj = {
      [`D${index + 1}`]: el,
    };
    arrVcell.push(tempObj);
  });
  const diffVCell = {
    diff_vcell: arrVcell,
  };
  return diffVCell;
};

const checkMaxDVC = async (req, res) => {
  const arrVCell = [];
  req.diff_vcell.map((item, index) => {
    Object.values(item).map((el, idx) => {
      arrVCell.push(el);
    });
  });
  const maxVCell = Math.max(...arrVCell);
  const setMaxCell = configCharging.setmaxVCell;
  return maxVCell > setMaxCell ? true : false;
};

const checkBatteryVoltage = async (req, res) => {
  try {
    const data = await M_frame.findAll({
      where: {
        frame_sn: req.body.frame_sn,
      },
      attributes: ["frame_sn", "status_test"],
      logging: false,
    });

    if (data.length > 0) {
      data.map(async (item, index) => {
        await axios({
          method: "GET",
          url: `${env.BASE_URL}/get-cms-data`,
          timeout: 50000,
        })
          .then((response) => {
            const store = [];
            const storeBID = [];
            const resp = response.data.cms_data;

            // map response data
            resp.map(async (el, idx) => {
              if (el.bid > 0) {
                storeBID.push(el);
              }
            });

            // map bid
            if (storeBID.length > 0) {
              storeBID.map(async (el, idx) => {
                if (
                  item.frame_sn === el.frame_name &&
                  item.status_test === true
                ) {
                  store.push(el);
                }
              });
            } else {
              return res
                .status(404)
                .json({ code: 404, status: false, msg: "BID_NOT_FOUND" });
            }

            // map store data
            if (store.length > 0) {
              store.map(async (el, idx) => {
                const frameName = el.frame_name;
                const vcell = el.vcell;
                const maxVoltage = [];
                vcell.map((el, index) => {
                  if (el > configCharging.maxCellBatt) {
                    maxVoltage.push(el);
                  }
                });
                return maxVoltage.length > 0
                  ? res.status(200).json({
                      code: 200,
                      status: false,
                      msg: "FULLY_CHARGED",
                    })
                  : res.status(200).json({
                      code: 200,
                      status: true,
                      msg: "BATTERY_NOT_FULLY_CHARGED",
                    });
              });
            } else {
              return res.status(404).json({
                code: 404,
                status: false,
                msg: "PLEASE_CHECK_FRAME_NAME_AND_STATUS_TEST",
              });
            }
          })
          .catch((err) => {
            console.log(`error get cms data ${err}`);
            if (err.code) {
              err.code = 500;
            }
            return res
              .status(500)
              .json({ code: 500, status: false, msg: err.message });
          });
      });
    } else {
      return res
        .status(404)
        .json({ code: 404, status: false, msg: "FRAME_NOT_FOUND_IN_MFRAME" });
    }
  } catch (err) {
    if (err.code) {
      err.code = 500;
    }
    return res.status(500).json({ code: 500, status: false, msg: err.message });
  }
};

const rectifierData = async (req, res) => {
  const rectiUrl = env.RECTI_URL;
  const rectiId = [1, 2, 3];
  try {
    const rectiIds = rectiId.map(async (id) => {
      const body = {
        group: 0,
        subaddress: id,
      };
      await axios({
        method: "POST",
        url: `${rectiUrl}/get-data-charger`,
        data: body,
        timeout: 50000,
      })
        .then(async (response) => {
          const resp = response.data;
          const module_off = resp.module_off;
          const voltage = resp.voltage;
          const current = resp.current;
          console.log("Processing rectifier data");

          const sql = `
                    INSERT INTO rectifier_logger_${id} (module_off, voltage, current)
                    VALUES ('${module_off}', '${voltage}', '${current}')
                `;
          await db.query(sql, { type: db.QueryTypes.INSERT });
          console.log(`insert data into table rectifier_logger_${id} success`);
          return id === 3
            ? res.status(201).json({
                code: 201,
                status: true,
                msg: "INSERT_RECTIFIER_DATA_SUCCESS",
              })
            : null;
        })
        .catch((err) => {
          if (err.code) {
            err.code = 400;
          }
          return res
            .status(500)
            .json({ code: 500, status: false, msg: err.message });
        });
    });
  } catch (err) {
    if (err.code) {
      err.code = 500;
    }
    return res.status(500).json({ code: 500, status: false, msg: err.message });
  }
};

const updateResultStatus = async (req, res) => {
  try {
    const data = await M_frame.findAll({
      where: {
        frame_sn: req.body.frame_sn,
      },
      attributes: ["frame_sn", "status_test"],
      logging: false,
    });

    if (data.length > 0) {
      data.map(async (item, index) => {
        await axios({
          method: "GET",
          url: `${env.BASE_URL}/get-cms-data`,
          timeout: 50000,
        })
          .then((response) => {
            const store = [];
            const storeBID = [];
            const resp = response.data.cms_data;

            // map response data
            resp.map(async (el, idx) => {
              if (el.bid > 0) {
                storeBID.push(el);
              }
            });

            // map bid
            if (storeBID.length > 0) {
              storeBID.map(async (el, idx) => {
                if (
                  item.frame_sn === el.frame_name &&
                  item.status_test === true
                ) {
                  store.push(el);
                }
              });
            } else {
              return res
                .status(404)
                .json({ code: 404, status: false, msg: "BID_NOT_FOUND" });
            }

            // map store data
            if (store.length > 0) {
              store.map(async (el, idx) => {
                const frameName = el.frame_name;
                const vcell = el.vcell;
                const getDiffVCell = await differentVoltageCell(vcell);
                const resultDVC = await checkMaxDVC(getDiffVCell);

                if (resultDVC) {
                  const sql = `UPDATE m_frame SET result = 'fail' WHERE frame_sn = '${frameName}'`;
                  await db.query(sql, {
                    type: db.QueryTypes.UPDATE,
                    logging: false,
                  });
                  console.log(
                    `Update status result 'fail' to table m_frame Success`
                  );
                  res.status(200).json({
                    code: 200,
                    status: true,
                    msg: "UPDATE_RESULT_STATUS_SUCCESS",
                  });
                } else {
                  const sql = `UPDATE m_frame SET result = 'pass' WHERE frame_sn = '${frameName}'`;
                  await db.query(sql, {
                    type: db.QueryTypes.UPDATE,
                    logging: false,
                  });
                  console.log(
                    `Update status result 'pass' to table m_frame Success`
                  );
                  return res.status(200).json({
                    code: 200,
                    status: true,
                    msg: "UPDATE_RESULT_STATUS_SUCCESS",
                  });
                }
              });
            } else {
              return res.status(404).json({
                code: 404,
                status: false,
                msg: "PLEASE_CHECK_FRAME_NAME_AND_STATUS_TEST",
              });
            }
          })
          .catch((err) => {
            if (err.code) {
              err.code = 400;
            }
            return res
              .status(500)
              .json({ code: 500, status: false, msg: err.message });
          });
      });
    } else {
      return res
        .status(404)
        .json({ code: 404, status: false, msg: "FRAME_NOT_FOUND" });
    }
  } catch (err) {
    if (err.code) {
      err.code = 500;
    }
    return res.status(500).json({ code: 500, status: false, msg: err.message });
  }
};

const updateStatusTest = async (req, res) => {
  try {
    const data = await M_frame.findAll({
      where: {
        frame_sn: req.body.frame_sn,
      },
      attributes: ["frame_sn", "status_test"],
      logging: false,
    });

    if (data.length > 0) {
      data.map(async (item, index) => {
        await axios({
          method: "GET",
          url: `${env.BASE_URL}/get-cms-data`,
          timeout: 50000,
        })
          .then((response) => {
            const store = [];
            const storeBID = [];
            const resp = response.data.cms_data;

            // map response data
            resp.map(async (el, idx) => {
              if (el.bid > 0) {
                storeBID.push(el);
              }
            });

            // map bid
            if (storeBID.length > 0) {
              storeBID.map(async (el, idx) => {
                if (
                  item.frame_sn === el.frame_name &&
                  item.status_test === true
                ) {
                  store.push(el);
                }
              });
            } else {
              return res
                .status(404)
                .json({ code: 404, status: false, msg: "BID_NOT_FOUND" });
            }

            // map store data
            if (store.length > 0) {
              store.map(async (el, idx) => {
                const frameName = el.frame_name;
                const sql = `UPDATE m_frame SET status_test = false WHERE frame_sn = '${frameName}'`;
                await db.query(sql, {
                  type: db.QueryTypes.UPDATE,
                  logging: false,
                });
                console.log(
                  `Update status test 'false' to table m_frame Success`
                );
                return res.status(200).json({
                  code: 200,
                  status: true,
                  msg: "UPDATE_STATUS_TEST_SUCCESS",
                });
              });
            } else {
              return res.status(404).json({
                code: 404,
                status: false,
                msg: "PLEASE_CHECK_FRAME_NAME_AND_STATUS_TEST",
              });
            }
          })
          .catch((err) => {
            if (err.code) {
              err.code = 400;
            }
            return res
              .status(500)
              .json({ code: 500, status: false, msg: err.message });
          });
      });
    } else {
      return res
        .status(404)
        .json({ code: 404, status: false, msg: "FRAME_NOT_FOUND" });
    }
  } catch (err) {
    if (err.code) {
      err.code = 500;
    }
    return res.status(500).json({ code: 500, status: false, msg: err.message });
  }
};

const updateStatusChecking = async (req, res) => {
  try {
    const data = await M_frame.findAll({
      where: {
        frame_sn: req.body.frame_sn,
      },
      attributes: ["frame_sn", "status_checking"],
      logging: false,
    });

    if (data.length > 0) {
      data.map(async (item, index) => {
        await axios({
          method: "GET",
          url: `${env.BASE_URL}/get-cms-data`,
          timeout: 50000,
        })
          .then((response) => {
            const store = [];
            const storeBID = [];
            const resp = response.data.cms_data;

            // map response data
            resp.map(async (el, idx) => {
              if (el.bid > 0) {
                storeBID.push(el);
              }
            });

            // map bid
            if (storeBID.length > 0) {
              storeBID.map(async (el, idx) => {
                if (
                  item.frame_sn === el.frame_name &&
                  item.status_checking === false
                ) {
                  store.push(el);
                }
              });
            } else {
              return res
                .status(404)
                .json({ code: 404, status: false, msg: "BID_NOT_FOUND" });
            }

            // map store data
            if (store.length > 0) {
              store.map(async (el, idx) => {
                const frameName = el.frame_name;
                const sql = `UPDATE m_frame SET status_checking = true WHERE frame_sn = '${frameName}'`;
                await db.query(sql, {
                  type: db.QueryTypes.UPDATE,
                  logging: false,
                });
                console.log(
                  `Update status checking 'true' to table m_frame Success`
                );
                res.status(200).json({
                  code: 200,
                  status: true,
                  msg: "UPDATE_STATUS_CHECKING_SUCCESS",
                });
              });
            } else {
              return res.status(404).json({
                code: 404,
                status: false,
                msg: "PLEASE_CHECK_FRAME_NAME_AND_STATUS_TEST",
              });
            }
          })
          .catch((err) => {
            if (err.code) {
              err.code = 400;
            }
            return res
              .status(500)
              .json({ code: 500, status: false, msg: err.message });
          });
      });
    } else {
      return res
        .status(404)
        .json({ code: 404, status: false, msg: "FRAME_NOT_FOUND" });
    }
  } catch (err) {
    if (err.code) {
      err.code = 500;
    }
    return res.status(500).json({ code: 500, status: false, msg: err.message });
  }
};

const longBatteryChargingTime = async (req, res) => {
  const data = await M_frame.findAll({
    where: {
      frame_sn: req.body.frame_sn,
    },
    attributes: ["createdAt"],
    logging: false,
  });

  if (data.length > 0) {
    data.map(async (item, index) => {
      const createdAt = moment(item.createdAt).format("YYYY-MM-DD HH:mm:ss");
      const now = moment().format("YYYY-MM-DD HH:mm:ss");
      const diff = moment.duration(moment(now).diff(moment(createdAt)));

      const duration = moment.duration(diff, "hours");
      const n = 24 * 60 * 60 * 1000;
      const days = Math.floor(duration / n);
      const str = moment.utc(duration % n).format("H [h] mm [min] ss [s]");
      const chargingDuration = `${
        days > 0 ? `${days} ${days == 1 ? "day" : "days"} ` : ""
      }${str}`;
      // console.log(`${days > 0 ? `${days} ${days == 1 ? 'day' : 'days'} ` : ''}${str}`);

      // save to database
      const sql = `UPDATE m_frame SET duration_charging = '${chargingDuration}' WHERE frame_sn = '${req.body.frame_sn}'`;
      await db.query(sql, {
        type: db.QueryTypes.UPDATE,
        logging: false,
      });

      return res.status(200).json({
        code: 200,
        status: true,
        msg: "GET_LONG_BATTERY_CHARGING_TIME_SUCCESS",
        data: chargingDuration,
      });
    });
  }
};

const validateTime = async (req, res) => {
  const now = moment().format("HH:mm");
  const death = "16:58";
  return now > death
    ? res.status(200).json({ code: 200, status: true, msg: "TIME_IS_OVER" })
    : res
        .status(200)
        .json({ code: 200, status: false, msg: "TIME_IS_NOT_OVER" });
};

export {
  cmsData,
  rectifierData,
  updateStatusTest,
  updateResultStatus,
  updateStatusChecking,
  validateTime,
  checkTemperature,
  checkBatteryVoltage,
  clearRealtimeTable,
  totalBatteryVoltage,
  longBatteryChargingTime,
};
