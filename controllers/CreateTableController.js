import { Sequelize } from "sequelize";
import db from "../config/dataBase.js";

// import M_frame from "../models/M_frameModel.js";

// export const createTable = async (req, res) => {
//   try {
//     const response = await M_frame.findAll();
//     res.status(200).json(response);
//   } catch (error) {
//     console.log(error.message);
//   }
// };

export const createTable = async (req, res) => {
  const frame_sn = res.req.body.frame_sn;

  try {
    const { DataTypes } = Sequelize;
    const table_create = db.define(
      frame_sn,
      {
        frame_sn: {
          type: Sequelize.STRING,
        },
        bid: {
          type: Sequelize.INTEGER,
        },
        v1: {
          type: Sequelize.INTEGER,
        },
        v2: {
          type: Sequelize.INTEGER,
        },
        v3: {
          type: Sequelize.INTEGER,
        },
        v4: {
          type: Sequelize.INTEGER,
        },
        v5: {
          type: Sequelize.INTEGER,
        },
        v6: {
          type: Sequelize.INTEGER,
        },
        v7: {
          type: Sequelize.INTEGER,
        },
        v8: {
          type: Sequelize.INTEGER,
        },
        v9: {
          type: Sequelize.INTEGER,
        },
        v10: {
          type: Sequelize.INTEGER,
        },
        v11: {
          type: Sequelize.INTEGER,
        },
        v12: {
          type: Sequelize.INTEGER,
        },
        v13: {
          type: Sequelize.INTEGER,
        },
        v14: {
          type: Sequelize.INTEGER,
        },
        v15: {
          type: Sequelize.INTEGER,
        },
        v16: {
          type: Sequelize.INTEGER,
        },
        v17: {
          type: Sequelize.INTEGER,
        },
        v18: {
          type: Sequelize.INTEGER,
        },
        v19: {
          type: Sequelize.INTEGER,
        },
        v20: {
          type: Sequelize.INTEGER,
        },
        v21: {
          type: Sequelize.INTEGER,
        },
        v22: {
          type: Sequelize.INTEGER,
        },
        v23: {
          type: Sequelize.INTEGER,
        },
        v24: {
          type: Sequelize.INTEGER,
        },
        v25: {
          type: Sequelize.INTEGER,
        },
        v26: {
          type: Sequelize.INTEGER,
        },
        v27: {
          type: Sequelize.INTEGER,
        },
        v28: {
          type: Sequelize.INTEGER,
        },
        v29: {
          type: Sequelize.INTEGER,
        },
        v30: {
          type: Sequelize.INTEGER,
        },
        v31: {
          type: Sequelize.INTEGER,
        },
        v32: {
          type: Sequelize.INTEGER,
        },
        v33: {
          type: Sequelize.INTEGER,
        },
        v34: {
          type: Sequelize.INTEGER,
        },
        v35: {
          type: Sequelize.INTEGER,
        },
        v36: {
          type: Sequelize.INTEGER,
        },
        v37: {
          type: Sequelize.INTEGER,
        },
        v38: {
          type: Sequelize.INTEGER,
        },
        v39: {
          type: Sequelize.INTEGER,
        },
        v40: {
          type: Sequelize.INTEGER,
        },
        v41: {
          type: Sequelize.INTEGER,
        },
        v42: {
          type: Sequelize.INTEGER,
        },
        v43: {
          type: Sequelize.INTEGER,
        },
        v44: {
          type: Sequelize.INTEGER,
        },
        v45: {
          type: Sequelize.INTEGER,
        },
        t1: {
          type: Sequelize.INTEGER,
        },
        t2: {
          type: Sequelize.INTEGER,
        },
        t3: {
          type: Sequelize.INTEGER,
        },
        t4: {
          type: Sequelize.INTEGER,
        },
        t5: {
          type: Sequelize.INTEGER,
        },
        t6: {
          type: Sequelize.INTEGER,
        },
        t7: {
          type: Sequelize.INTEGER,
        },
        t8: {
          type: Sequelize.INTEGER,
        },
        t9: {
          type: Sequelize.INTEGER,
        },
        vp1: {
          type: Sequelize.INTEGER,
        },
        vp2: {
          type: Sequelize.INTEGER,
        },
        vp3: {
          type: Sequelize.INTEGER,
        },
        wake_status: {
          type: Sequelize.INTEGER,
        },
        diff_vcell: {
          type: Sequelize.JSON,
        },
        createdAt: {
          type: Sequelize.DATE(3),
          allowNull: false,
          defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        },
        updatedAt: {
          type: Sequelize.DATE(3),
          allowNull: false,
          defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        },
      },
      {
        freezeTableName: true,
      }
    );

    (async () => {
      await db.sync();
    })();

    res.status(200).json({ msg: "success" });
  } catch (error) {}
};
