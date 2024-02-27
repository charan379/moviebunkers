import bcrypt from "bcryptjs";

const saltRounds = 12;

/**
 * Generates a hash for a plain password
 * @param plainPassword - The plain text password to hash
 * @returns A promise that resolves to the hashed password
 */
export async function generateHash(plainPassword: unknown): Promise<string> {
    // Validate that the input parameter is a string
    if (typeof plainPassword !== 'string') {
        throw new Error('Plain password must be a string');
    }
    try {
        // Generate a unique and strong salt
        const salt = await bcrypt.genSalt(saltRounds);
        // Hash the plain password using the salt
        const hashedPassword = await bcrypt.hash(plainPassword, salt);
        return hashedPassword;
    } catch (error) {
        throw new Error('Failed to generate password hash');
    }
};

/**
 * Validates a plain password against a hashed password
 * @param plainPassword - The plain text password to validate
 * @param hashedPassword - The hashed password to compare against
 * @returns A promise that resolves to a boolean indicating whether the passwords match
 */
export async function validateHash(plainPassword: unknown, hashedPassword: unknown): Promise<boolean> {
    // Validate that the input parameters are strings
    if (typeof plainPassword !== 'string' || typeof hashedPassword !== 'string') {
        throw new Error('Plain password and hashed password must be strings');
    }
    try {
        // Compare the plain password against the hashed password
        const isMatch: boolean = await bcrypt.compare(plainPassword, hashedPassword);
        return isMatch;
    } catch (error) {
        throw new Error('Failed to validate password hash');
    }
}
