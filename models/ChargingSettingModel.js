import { Sequelize } from "sequelize";
import db from "../config/dataBase.js";

const { DataTypes } = Sequelize;

const M_setting = db.define(
  "charging_setting",
  {
    max_voltage_cell: {
      type: Sequelize.INTEGER,
      unique: false,
    },
    min_voltage_cell: {
      type: Sequelize.INTEGER,
      unique: false,
    },
    total_cell: {
      type: Sequelize.INTEGER,
      unique: false,
    },
    recti_voltage: {
      type: Sequelize.INTEGER,
      unique: false,
    },
    recti_current: {
      type: Sequelize.INTEGER,
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
