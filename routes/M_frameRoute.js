import express from "express";
import {
  createMframe,
  deleteMframe,
  getMframe,
  getMframeById,
  updateMframeById,
  getMframByFrame,
  updateMframeByFrame,
  deletebyMframe,
} from "../controllers/M_frameController.js";

const router = express.Router();

router.get("/getMframe", getMframe);
router.get("/getMframe/:id", getMframeById);
router.post("/createMframe", createMframe);

router.patch("/updateMframeById/:id", updateMframeById);
router.patch("/updateMframeByFrame/", updateMframeByFrame);
router.delete("/deleteMframe/:id", deleteMframe);
router.post("/getMframByFrame", getMframByFrame);
router.post("/deletebyMframe", deletebyMframe);
export default router;
