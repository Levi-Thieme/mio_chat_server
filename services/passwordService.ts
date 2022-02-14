import bcrypt from "bcrypt";

export async function hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
}

export function passwordMatchesHash(password: string, passwordHash: string): Promise<boolean> {
    return bcrypt.compare(password, passwordHash);
}