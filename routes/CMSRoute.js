import express from "express";
import { setFrameCMS, restartCMS } from "../controllers/CMSController.js";

const router = express.Router();

router.post("/setFrameCMS", setFrameCMS);
router.post("/restartCMS", restartCMS);

export default router;
