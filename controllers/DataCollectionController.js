import axios from "axios";
import dotenv from "dotenv";

const env = dotenv.config().parsed;

const setDataCollection = async (req, res) => {
  axios({
    method: "post",
    url: `${env.BASE_URL}/set-data-collection`,
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

export { setDataCollection };
