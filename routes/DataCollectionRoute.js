import express from "express";
import { setDataCollection } from "../controllers/DataCollectionController.js";

const router = express.Router();

router.post("/setDataCollection", setDataCollection);

export default router;
