import db from "../config/dataBase.js";

export const getTableDataAll = async (req, res) => {
  const frame_name = res.req.body.sn_frame;
  const frame_select = '"' + frame_name + '"';

  console.log("frame_name1 = " + frame_select);
  try {
    const result = await db.query("SELECT * FROM " + frame_select + "", {
      type: db.QueryTypes.SELECT,
    });
    res.status(200).json(result);
  } catch (error) {
    console.log(error.message);
  }
};

export const getTableDataById = async (req, res) => {
  const frame_name = res.req.body.sn_frame;
  const frame_select = '"' + frame_name + '"';

  console.log("frame_name1 = " + frame_select);
  try {
    const result = await db.query(
      "SELECT * FROM " +
        frame_select +
        " WHERE " +
        frame_select +
        ".id= (:id) ",
      {
        replacements: {
          id: req.body.id,
        },
        type: db.QueryTypes.SELECT,
      }
    );
    res.status(200).json(result);
  } catch (error) {
    console.log(error.message);
  }
};
