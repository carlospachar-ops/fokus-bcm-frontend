import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

export const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: "0512",
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT || 3306),
});