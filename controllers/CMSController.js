import axios from "axios";
import dotenv from "dotenv";

const env = dotenv.config().parsed;

export const getCMSData = async () => {
  try {
    const response = await axios.get(`${env.BASE_URL}/get-cms-data`, {
      timeout: 10000,
    });
    return response.data;
  } catch (error) {
    return error.message;
  }
};

export const getDeviceCMSInfo = async (req, res) => {
  axios({
    method: "get",
    url: `${env.BASE_URL}/get-device-cms-info`,
    timeout: 2000,
  })
    .then((response) => {
      res.status(200).json({
        status: true,
        data: response.data,
      });
    })
    .catch((error) => {
      res.status(500).json({
        status: false,
        message: error.message,
      });
    });
};

export const setSleepCMS = async (req, res) => {
  axios({
    method: "post",
    url: `${env.BASE_URL}/set-sleep`,
    data: req.body,
    timeout: 2000,
  })
    .then((response) => {
      res.status(200).json({
        status: true,
        data: response.data,
      });
    })
    .catch((error) => {
      res.status(500).json({
        status: false,
        message: error.message,
      });
    });
};

export const setWakeUpCMS = async (req, res) => {
  axios({
    method: "post",
    url: `${env.BASE_URL}/set-wakeup`,
    data: req.body,
    timeout: 2000,
  })
    .then((response) => {
      res.status(200).json({
        status: true,
        data: response.data,
      });
    })
    .catch((error) => {
      res.status(500).json({
        status: false,
        message: error.message,
      });
    });
};

export const setFrameCMS = async (req, res) => {
  axios({
    method: "post",
    url: `${env.BASE_URL}/set-frame`,
    data: req.body,
    timeout: 2000,
  })
    .then((response) => {
      res.status(200).json({
        status: true,
        data: response.data,
      });
    })
    .catch((error) => {
      res.status(500).json({
        status: false,
        message: error.message,
      });
    });
};

export const restartCMS = async (req, res) => {
  axios({
    method: "post",
    url: `${env.BASE_URL}/restart-cms`,
    data: req.body,
    timeout: 2000,
  })
    .then((response) => {
      res.status(200).json({
        status: true,
        data: response.data,
      });
    })
    .catch((error) => {
      res.status(500).json({
        status: false,
        message: error.message,
      });
    });
};
