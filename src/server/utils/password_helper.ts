// src/server/utils/password_helper.ts
import bcrypt from 'bcrypt';

export class PasswordHelper {
    private static readonly SALT_ROUNDS = 10;

    public static async hashPassword(password: string): Promise<string> {
        return await bcrypt.hash(password, this.SALT_ROUNDS);
    }

    public static async verifyPassword(password: string, hash: string): Promise<boolean> {
        return await bcrypt.compare(password, hash);
    }
}