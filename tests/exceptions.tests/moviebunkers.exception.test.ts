import HttpCodes from "@constants/http.codes.enum";
import MoviebunkersException from "@exceptions/moviebunkers.exception";

describe("MoviebunkersException", () => {
    it("should create an instance with default values", () => {
        const message = "Something went wrong";
        const exception = new MoviebunkersException(message);

        expect(exception).toBeInstanceOf(Error);
        expect(exception.name).toBe("MoviebunkersException");
        expect(exception.message).toBe(message);
        expect(exception.status).toBeUndefined();
        expect(exception.reason).toBeUndefined();
    });

    it("should create an instance with custom values", () => {
        const message = "Something went wrong";
        const status = HttpCodes.NOT_FOUND;
        const reason = "Invalid ID";
        const exception = new MoviebunkersException(message, status, reason);

        expect(exception).toBeInstanceOf(Error);
        expect(exception.name).toBe("MoviebunkersException");
        expect(exception.message).toBe(message);
        expect(exception.status).toBe(status);
        expect(exception.reason).toBe(reason);
    });
});
