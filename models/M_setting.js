import { Sequelize } from "sequelize";
import db from "../config/dataBase.js";

const { DataTypes } = Sequelize;

const M_setting = db.define(
  "m_setting",
  {
    recti_voltage: {
      type: Sequelize.BOOLEAN,
      unique: false,
    },

    recti_current: {
      type: Sequelize.BOOLEAN,
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

export default M_setting;
