import bcrypt from "bcrypt";

const saltRounds = 10;

export async function generateHash(plainPassword: string): Promise<string> {

    const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);

    return hashedPassword;
};


export async function validateHash(plainPassword: string, hashedPassword: string): Promise<boolean> {

    const isMatch: boolean = await bcrypt.compare(plainPassword, hashedPassword);

    return isMatch;
}