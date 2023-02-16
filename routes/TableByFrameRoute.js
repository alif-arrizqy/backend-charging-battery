import express from "express";
import {
  getTableDataById,
  getTableDataAll,
  deleteTableFrame,
} from "../controllers/TableByFrameController.js";

const router = express.Router();

router.post("/getTableDataById", getTableDataById);
router.post("/getTableDataAll", getTableDataAll);
router.post("/deleteTableFrame", deleteTableFrame);
export default router;
