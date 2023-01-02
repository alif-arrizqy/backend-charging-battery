import express from "express";
import {
  getTableDataById,
  getTableDataAll,
} from "../controllers/TableByFrameController.js";

const router = express.Router();

router.post("/getTableDataById", getTableDataById);
router.post("/getTableDataAll", getTableDataAll);

export default router;
