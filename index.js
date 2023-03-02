import dotenv from "dotenv";
const env = dotenv.config().parsed;

import express from "express";
import cors from "cors";
import M_frameRoute from "./routes/M_frameRoute.js";
import AddressingRoute from "./routes/AddressingRoute.js";
import CMSRoute from "./routes/CMSRoute.js";
import CreateTableRoute from "./routes/CreateTableRoute.js";
import TableByFrameRoute from "./routes/TableByFrameRoute.js";
import DataCollectionRoute from "./routes/DataCollectionRoute.js";
import RealTimeRoute from "./routes/RealTimeRoute.js";
import ChargingRoute from "./routes/ChargingRoute.js";
import RectifierRoute from "./routes/RectifierRoute.js";
import M_setting from "./routes/M_settingRoute.js";

const PORT = process.env.PORT || 3001;

const app = express();
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(M_frameRoute);
app.use(AddressingRoute);
app.use(CMSRoute);
app.use(CreateTableRoute);
app.use(TableByFrameRoute);
app.use(DataCollectionRoute);
app.use(RealTimeRoute);
app.use(ChargingRoute);
app.use(RectifierRoute);
app.use(M_setting);

app.listen(PORT, () => console.log(`SERVER UP AND RUNNING ${PORT}`));
