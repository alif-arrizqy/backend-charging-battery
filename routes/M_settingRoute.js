import express from "express";
import { getSetting } from "../controllers/M_settingController.js";

const router = express.Router();

router.post("/getSetting", getSetting);

export default router;
