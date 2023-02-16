import { where } from "sequelize";
import { Sequelize } from "sequelize";
import M_frame from "../models/M_frameModel.js";

export const getMframe = async (req, res) => {
  try {
    const response = await M_frame.findAll();
    res.status(200).json(response);
  } catch (error) {
    console.log(error.message);
  }
};

export const getMframeById = async (req, res) => {
  try {
    const response = await M_frame.findOne({
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json(response);
  } catch (error) {
    console.log(error.message);
  }
};

export const getMframByFrame = async (req, res) => {
  try {
    //iilke digunakan agar uppercase dan lowercase tidak pengaruh
    const frame_sn = req.body.frame_sn;
    console.log("tes : " + frame_sn);
    const response = await M_frame.findOne({
      where: { frame_sn: { [Sequelize.Op.iLike]: `%${frame_sn}%` } },
    });

    res.status(200).json({ msg: "sucess", data: response });
  } catch (error) {
    console.log(error.message);
  }
};

export const createMframe = async (req, res) => {
  try {
    const response = await M_frame.create(req.body);
    res.status(201).json({ msg: "Created", data: response });
  } catch (error) {
    // console.log(error.message);
    res.status(500).json({
      status: "failed",
      message: error.message,
    });
  }
};

export const updateMframeById = async (req, res) => {
  try {
    const response = await M_frame.update(req.params, {
      where: {
        id: req.params.id,
      },
    });

    res.status(200).json({ msg: "mframe Updated", data: response });
  } catch (error) {
    console.log(error.message);
  }
};

export const updateMframeByFrame = async (req, res) => {
  // try {
  //   const response = await M_frame.update(req.body, {
  //     where: {
  //       frame_sn: req.body.frame_sn,
  //     },
  //   });

  //   res.status(200).json({ msg: "mframe Updated" });
  // } catch (error) {
  //   console.log(error.message);
  // }

  try {
    const frame_sn = req.body.frame_sn;
    const result = req.body.result;
    const response = await M_frame.update(req.body, {
      where: { frame_sn: frame_sn },
    });

    if (response == 1) {
      console.log("hasil = " + response);
      res.status(200).json({ msg: "update success" });
    } else {
      console.log("hasil = " + response);
      res.status(200).json({ msg: "update failed" });
    }
  } catch (error) {
    console.log(error.message);
  }
};

export const deleteMframe = async (req, res) => {
  try {
    const response = await M_frame.destroy({
      where: {
        id: req.params.id,
      },
    });

    res.status(200).json({ msg: "mframe Deleted" });
  } catch (error) {
    console.log(error.message);
  }
};

export const deletebyMframe = async (req, res) => {
  try {
    const response = await M_frame.destroy({
      where: {
        frame_sn: req.body.frame_sn,
      },
    });

    res.status(200).json({ msg: "mframe_deleted" });
  } catch (error) {
    console.log(error.message);
  }
};
