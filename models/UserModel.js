import { Sequelize } from "sequelize";
import db from "../config/dataBase.js";

const userModel = db.define("users", {
  username: {
    type: Sequelize.STRING,
    unique: true,
  },
  password: {
    type: Sequelize.STRING,
    unique: false,
  },
  fullname: {
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
});

export default userModel
