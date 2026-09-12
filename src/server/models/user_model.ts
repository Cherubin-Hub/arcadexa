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

    public static async createUser(username: string, email: string, passwordHash: string, firstName: string, middleName: string, lastName: string): Promise<void> {
        const pool = await dbPoolPromise;
        await pool.request()
            .input('Username', sql.NVarChar, username)
            .input('Email', sql.NVarChar, email)
            .input('PasswordHash', sql.NVarChar, passwordHash)
            .input('FirstName', sql.NVarChar, firstName)
            .input('MiddleName', sql.NVarChar, middleName || null)
            .input('LastName', sql.NVarChar, lastName)
            .query(`
                INSERT INTO tblUsers (Username, Email, PasswordHash, FirstName, MiddleName, LastName)
                VALUES (@Username, @Email, @PasswordHash, @FirstName, @MiddleName, @LastName)
            `);
    }
}
