"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const dotenv = __importStar(require("dotenv"));
dotenv.config();
// const pool = new Pool({
//   user: 'postgres',
//   host: 'localhost',
//   database: 'connectNow',
//   password: process.env.PASSWORD,
//   port: 5432,
// });
const connectionString = 'postgres://connectnow_user:idzZ1Qbm7QufeGr7C8WJFLVft9Ju3HvD@dpg-cnagvv779t8c73c6d8g0-a.oregon-postgres.render.com/connectnow';
const pool = new pg_1.Pool({
    connectionString,
    ssl: {
        rejectUnauthorized: false, // For self-signed certificates
    },
});
const query = (text, params = []) => __awaiter(void 0, void 0, void 0, function* () {
    return yield pool.query(text, params);
});
exports.default = query;
// const logTables = async () => {
//   try {
//     const queryResult = await query(`
//       SELECT table_name
//       FROM information_schema.tables
//       WHERE table_schema = 'public'
//       AND table_type = 'BASE TABLE';
//     `);
//     console.log('Tables present in the database:');
//     queryResult.rows.forEach(row => {
//       console.log(row.table_name);
//     });
//   } catch (error) {
//     console.error('Error fetching tables:', error);
//   } finally {
//     pool.end(); // Close the pool when done
//   }
// };
// logTables(); 
// const createTableQuery = `
// ALTER TABLE posts
// ALTER COLUMN media_link TYPE VARCHAR(2600);
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
