import { Pool } from "pg";
import { DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME } from "../env";

const pool: Pool = new Pool({
  user: DB_USER,
  host: DB_HOST,
  database: DB_NAME,
  password: DB_PASSWORD,
  port: DB_PORT,
});

export default pool;
