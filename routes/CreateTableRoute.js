import express from "express";
import { createTable } from "../controllers/CreateTableController.js";

const router = express.Router();

router.post("/createTable", createTable);

export default router;
