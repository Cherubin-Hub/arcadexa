// src/server/models/user_model.ts
import sql from 'mssql';
import { dbPoolPromise } from '../utils/database';

export class UserModel {
    
    /**
     * Looks up a user by their email address. Only returns active users.
     */
    public static async findByEmail(email: string): Promise<any> {
        const pool = await dbPoolPromise;
        const result = await pool.request()
            .input('Email', sql.NVarChar, email)
            .query('SELECT * FROM tblUsers WHERE Email = @Email AND IsActive = 1');
        
        return result.recordset[0]; // Returns the user object, or undefined if not found
    }

    /**
     * Inserts a new user into the database.
     */
    public static async createUser(username: string, email: string, passwordHash: string): Promise<void> {
        const pool = await dbPoolPromise;
        await pool.request()
            .input('Username', sql.NVarChar, username)
            .input('Email', sql.NVarChar, email)
            .input('PasswordHash', sql.NVarChar, passwordHash)
            .query(`
                INSERT INTO tblUsers (Username, Email, PasswordHash)
                VALUES (@Username, @Email, @PasswordHash)
            `);
    }
}
