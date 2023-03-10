import { Sequelize } from "sequelize";
import dotenv from "dotenv";
const env = dotenv.config().parsed;

const username = 'sundaya';
const password = process.env.PASSWORD;
const database = process.env.DATABASE;
const host = process.env.DB_HOST;
const dialect = process.env.DB_CONNECTION;
const port = process.env.DB_PORT_EXPOSE;

const db = new Sequelize(database, username, password, {
  host: host,
  dialect: dialect,
  port: port,
});

export default db;
