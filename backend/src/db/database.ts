import { Pool, QueryResult, QueryResultRow } from 'pg';
import * as dotenv from 'dotenv';
dotenv.config();

// const pool = new Pool({
//   user: 'postgres',
//   host: 'localhost',
//   database: 'connectNow',
//   password: process.env.PASSWORD,
//   port: 5432,
// });

const connectionString = 'postgres://connectnow_user:idzZ1Qbm7QufeGr7C8WJFLVft9Ju3HvD@dpg-cnagvv779t8c73c6d8g0-a.oregon-postgres.render.com/connectnow';

const pool = new Pool({
    connectionString,
    ssl: {
        rejectUnauthorized: false, // For self-signed certificates
    },
});

const query = async <T extends QueryResultRow>(text: string, params: any[] = []): Promise<QueryResult<T>> => {
  return await pool.query<T>(text, params);
};

export default query;



// const logTables = async () => {
//   try {
//     const queryResult = await query(`
//       SELECT *
//       FROM users_account;
//     `);

//     console.log('Data from the users_account table:');
//     queryResult.rows.forEach(row => {
//       console.log(row);
//     });
//   } catch (error) {
//     console.error('Error fetching tables:', error);
//   } finally {
//     pool.end(); // Close the pool when done
//   }
// };

// logTables();




// const createTableQuery = `
// CREATE TABLE users_account (
//   user_id SERIAL PRIMARY KEY,s
//   email_address VARCHAR(255) UNIQUE NOT NULL,
//   password VARCHAR(255) NOT NULL,
//   refresh_token VARCHAR(255),
//   account_created_at TIMESTAMP DEFAULT (CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Kolkata') NOT NULL
// );
// `;

// const createTable = async () => {
//     try {
//         const result = await query(createTableQuery);
//         console.log('Table created successfully:', result);
//     } catch (error) {
//         console.error('Error creating table:', error);
//     } finally {
//         pool.end(); // Close the pool when done
//     }
// };

// createTable();