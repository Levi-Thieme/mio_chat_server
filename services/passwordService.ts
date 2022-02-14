import bcrypt from "bcrypt";

export type Password = {
    salt: string,
    hash: string
}

export async function hashPassword(password: string): Promise<Password> {
    const salt: string = await bcrypt.genSalt(10);
    const hash: string = await bcrypt.hash(password, salt);
    return { salt: salt, hash: hash };
}

export function passwordMatchesHash(password: string, passwordHash: string): Promise<boolean> {
    return bcrypt.compare(password, passwordHash);
}