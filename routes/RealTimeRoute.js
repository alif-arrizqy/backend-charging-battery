import express from "express";
import { getAllRealTime } from "../controllers/RealTimeController.js";

const router = express.Router();

router.post("/getAllRealTime", getAllRealTime);

export default router;
