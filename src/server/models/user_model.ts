import sql from 'mssql';
import { dbPoolPromise } from '../utils/database';

export class UserModel {

    public static async findByUsername(username: string): Promise<any> {
        const pool = await dbPoolPromise;
        const result = await pool.request()
            .input('Username', sql.NVarChar, username)
            .query('SELECT * FROM tblUsers WHERE Username = @Username AND IsActive = 1');

        return result.recordset[0];
    }

    public static async findByEmail(email: string): Promise<any> {
        const pool = await dbPoolPromise;
        const result = await pool.request()
            .input('Email', sql.NVarChar, email)
            .query('SELECT * FROM tblUsers WHERE Email = @Email AND IsActive = 1');

        return result.recordset[0];
    }

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
