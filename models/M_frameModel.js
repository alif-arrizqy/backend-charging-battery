import { Sequelize } from "sequelize";
import db from "../config/dataBase.js";

const { DataTypes } = Sequelize;

// const M_frame = db.define(
//   "m_frame",
//   {
//     // id: DataTypes.INTEGER,
//     // kd_site: DataTypes.STRING,
//     frame_sn: DataTypes.STRING,
//     status_test: DataTypes.BOOLEAN,
//     // ip_adrs: DataTypes.STRING,
//     // created_at: DataTypes.datetime,
//     // updated_at: DataTypes.datetime,
//   },
//   {
//     freezeTabaleName: true,
//   }
// );

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

(async () => {
  await db.sync();
})();
