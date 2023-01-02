import express from "express";
import { setFrameCMS } from "../controllers/CMSController.js";

const router = express.Router();

router.post("/setFrameCMS", setFrameCMS);

export default router;
