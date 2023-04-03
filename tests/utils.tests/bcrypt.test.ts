import { generateHash, validateHash } from '@utils/bcrypt';
import bcrypt from 'bcrypt';

jest.mock('bcrypt');

describe('passwordUtils', () => {
    describe('generateHash', () => {
        it('should generate a hash for a plain password', async () => {
            const plainPassword = 'password123';
            const salt = '$2b$12$salt123';
            const hashedPassword = '$2b$12$salt123hashedpassword';
            bcrypt.genSalt = jest.fn().mockResolvedValue(salt);
            bcrypt.hash = jest.fn().mockResolvedValue(hashedPassword);

            const result = await generateHash(plainPassword);

            expect(result).toEqual(hashedPassword);
            expect(bcrypt.genSalt).toHaveBeenCalledWith(12);
            expect(bcrypt.hash).toHaveBeenCalledWith(plainPassword, salt);
        });

        it('should throw an error if the plain password is not a string', async () => {
            const plainPassword = 123;

            await expect(generateHash(plainPassword)).rejects.toThrowError('Plain password must be a string');
        });

        it('should throw an error if hashing fails', async () => {
            const plainPassword = 'password123';
            const errorMessage = 'Error generating hash';
            bcrypt.genSalt = jest.fn().mockRejectedValue(new Error(errorMessage));

            await expect(generateHash(plainPassword)).rejects.toThrowError('Failed to generate password hash');
        });
    });

    describe('validateHash', () => {
        it('should validate a plain password against a hashed password', async () => {
            const plainPassword = 'password123';
            const hashedPassword = '$2b$12$salt123hashedpassword';
            const isMatch = true;
            bcrypt.compare = jest.fn().mockResolvedValue(isMatch);

            const result = await validateHash(plainPassword, hashedPassword);

            expect(result).toEqual(isMatch);
            expect(bcrypt.compare).toHaveBeenCalledWith(plainPassword, hashedPassword);
        });

        it('should throw an error if the plain password is not a string', async () => {
            const plainPassword = 123;
            const hashedPassword = '$2b$12$salt123hashedpassword';

            await expect(validateHash(plainPassword, hashedPassword)).rejects.toThrowError('Plain password and hashed password must be strings');
        });

        it('should throw an error if the hashed password is not a string', async () => {
            const plainPassword = 'password123';
            const hashedPassword = 123;

            await expect(validateHash(plainPassword, hashedPassword)).rejects.toThrowError('Plain password and hashed password must be strings');
        });

        it('should throw an error if validation fails', async () => {
            const plainPassword = 'password123';
            const hashedPassword = '$2b$12$salt123hashedpassword';
            const errorMessage = 'Error validating hash';
            bcrypt.compare = jest.fn().mockRejectedValue(new Error(errorMessage));

            await expect(validateHash(plainPassword, hashedPassword)).rejects.toThrowError('Failed to validate password hash');
        });
    });
});
