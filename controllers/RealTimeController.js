// import { where } from "sequelize";
import M_frame from "../models/RealTimeModel.js";
import Real_time from "../models/RealTimeModel.js";

export const getAllRealTime = async (req, res) => {
  try {
    const response = await M_frame.findAll();
    res.status(200).json(response);
  } catch (error) {
    console.log(error.message);
  }
};
