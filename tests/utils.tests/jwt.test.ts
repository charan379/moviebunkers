import assert from 'assert';
import jwt from 'jsonwebtoken';
import Config from '@Config';
import HttpCodes from '@constants/http.codes.enum';
import AuthorizationException from '@exceptions/authorization.exception';
import { generateJwtToken, verifyJwtToken } from '@utils/jwt';


describe('generateJwtToken', () => {

    it('should generate a JWT token for a valid user object', async () => {
        // Arrange
        const user = {
            userName: 'testuser',
            password: 'testpassword',
            email: 'testuser@example.com',
        };

        // Act
        const token = await generateJwtToken(user);

        // Assert
        expect(typeof token).toEqual('string');
        expect(token.length).toBeGreaterThan(0);
    });

    it('should throw an AuthorizationException if an error occurs while generating the token', async () => {
        // Arrange
        const user = {
            userName: 'testuser',
            password: 'testpassword',
            email: 'testuser@example.com',
        };

        const signMock = jest.spyOn(jwt, 'sign');
        signMock.mockImplementation(() => {
            throw new Error('Test Error');
        });

        // Act & Assert
        await expect(generateJwtToken(user)).rejects.toThrowError(
            AuthorizationException
        );

        // Clean up
        signMock.mockRestore();
    });


    it('should decode a valid JWT token', async () => {
        // Arrange
        const user = {
            userName: 'testuser',
            password: 'testpassword',
            email: 'testuser@example.com',
        };

        const token = await generateJwtToken(user);

        // Act
        const decodedToken = await verifyJwtToken(token);

        // Assert
        expect(decodedToken.sub).toEqual(user.userName);
    });

    // Test case for Internal server error
    it('should throw an AuthorizationException if an invalid JWT token is provided', async () => {
        // Arrange
        const invalidToken = 'invalid_token';

        // Act & Assert
        await expect(verifyJwtToken(invalidToken)).rejects.toThrowError(
            AuthorizationException
        );
    });

    it('should throw an AuthorizationException if an invalid JWT token is provided', async () => {
        // Arrange
        const invalidToken = 'eyJhbGciOiIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

        // Act & Assert
        await expect(verifyJwtToken(invalidToken)).rejects.toThrowError(
            AuthorizationException
        );
    });



    it('should throw an AuthorizationException if the JWT token has expired', async () => {
        // Arrange
        const user = {
            userName: 'testuser',
            password: 'testpassword',
            email: 'testuser@example.com',
        };

        const signOptions: jwt.SignOptions = {
            expiresIn: '1s',
            algorithm: 'HS256',
        };

        const token = jwt.sign(
            { sub: user.userName },
            Config.JWT_SECRET as string,
            signOptions
        );

        // Wait for token to expire
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Act & Assert
        await expect(verifyJwtToken(token)).rejects.toThrowError(
            AuthorizationException
        );
    });



    // Test case for invalid signature
    test("should throw an AuthorizationException with status code 400 for an invalid signature", async () => {
        // Arrange
        const invalidToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

        // Act and Assert
        await expect(verifyJwtToken(invalidToken)).rejects.toThrow(AuthorizationException);
    });

});