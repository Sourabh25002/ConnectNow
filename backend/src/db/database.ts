import { Pool, QueryResult, QueryResultRow } from 'pg';
import * as dotenv from 'dotenv';
dotenv.config();

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'connectNow',
  password: process.env.PASSWORD,
  port: 5432,
});

const query = async <T extends QueryResultRow>(text: string, params: any[] = []): Promise<QueryResult<T>> => {
  return await pool.query<T>(text, params);
};

export default query;
