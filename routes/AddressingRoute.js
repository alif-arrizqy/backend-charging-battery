import express from "express";
import {
  setAddressing,
  getAddressing,
} from "../controllers/AddressingController.js";

const router = express.Router();

router.post("/setAddressing", setAddressing);
router.get("/getAddressing", getAddressing);

export default router;
