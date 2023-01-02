import axios from "axios";
import dotenv from "dotenv";

const env = dotenv.config().parsed;

export const setAddressing = async (req, res) => {
  axios({
    method: "post",
    url: `${process.env.BASE_URL}/set-addressing`,
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

export const getAddressing = async (req, res) => {
  axios({
    method: "get",
    url: `${process.env.BASE_URL}/get-addressing-status`,
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
// export { setAddressing };
