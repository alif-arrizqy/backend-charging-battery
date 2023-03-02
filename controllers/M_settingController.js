import M_setting from "../models/M_setting.js";

export const getSetting = async (req, res) => {
  try {
    const response = await M_setting.findAll();
    res.status(200).json(response);
  } catch (error) {
    console.log(error.message);
  }
};
