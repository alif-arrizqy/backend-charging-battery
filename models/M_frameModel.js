import { Sequelize } from "sequelize";
import db from "../config/dataBase.js";

const { DataTypes } = Sequelize;

const M_frame = db.define(
  "m_frame",
  {
    frame_sn: {
      type: Sequelize.STRING,
      unique: true,
    },
    status_test: {
      type: Sequelize.BOOLEAN,
      unique: false,
    },
    status_checking: {
      type: Sequelize.BOOLEAN,
      unique: false,
    },
    result: {
      type: Sequelize.STRING,
      unique: false,
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

export default M_frame;

// (async () => {
//   await db.sync({ alter: true });
// })();
