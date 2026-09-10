// src/server/utils/database.ts
import sql from 'mssql';
import dotenv from 'dotenv';

// Load variables from the .env file
dotenv.config();

const dbConfig: sql.config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER || 'localhost',
    database: process.env.DB_NAME,
    options: {
        encrypt: false, // Set to true if you are hosting on Azure
        trustServerCertificate: true // Crucial for local development on Windows
    }
};

// We export a Promise that resolves to our Connection Pool. 
// This ensures we only connect once when the server starts.
export const dbPoolPromise = new sql.ConnectionPool(dbConfig)
    .connect()
    .then(pool => {
        console.log('Successfully connected to MSSQL Database');
        return pool;
    })
    .catch(err => {
        console.error('Database Connection Failed! Check your .env file: ', err);
        throw err;
    });
