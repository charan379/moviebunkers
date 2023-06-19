import OTPType from "@constants/otpType.enum";

/**
 * Generates a random OTP (One-Time Password) based on the specified options.
 * @param {number} otpLength - The length of the OTP. Default is 4.
 * @param {OTPType} otpType - The type of OTP. Default is OTPType.NUMERIC.
 * @param {boolean} includeSpecialChars - Specifies whether to include special characters in the OTP. Default is false.
 * @returns {string} The generated OTP.
 */
function generateOTP(
    otpLength: number = 4,
    otpType: OTPType = OTPType.NUMERIC,
    includeSpecialChars: boolean = false
): string {
    // Character sets for different OTP types
    const numeric = "0123456789";
    const alphabetsSmallCase = "abcdefghijklmnopqrstuvwxyz";
    const alphabetsUpperCase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const specialChars = "~!@#$%^&*()\\|/?<>";

    // Selected OTP character set based on otpType
    let otpChars = "";
    let OTP = "";

    switch (otpType) {
        case OTPType.NUMERIC:
            otpChars = numeric;
            break;
        case OTPType.ALPHA_NUMERIC_CASE_UP:
            otpChars = numeric + alphabetsUpperCase;
            break;
        case OTPType.ALPHA_NUMERIC_CASE_SMALL:
            otpChars = numeric + alphabetsSmallCase;
            break;
        case OTPType.ALPHA_CASE_UP:
            otpChars = alphabetsUpperCase;
            break;
        case OTPType.ALPHA_CASE_SMALL:
            otpChars = alphabetsSmallCase;
            break;
        case OTPType.ALPHA_NUMERIC_CASE_COMBINED:
            otpChars = numeric + alphabetsSmallCase + alphabetsUpperCase;
            break;
        case OTPType.ALPHA_CASE_COMBINED:
            otpChars = alphabetsSmallCase + alphabetsUpperCase;
            break;
        default:
            break;
    }

    // Include special characters if specified
    if (includeSpecialChars) {
        otpChars = otpChars + specialChars;
    }

    // Generate the OTP
    var len = otpChars.length;
    for (let i = 0; i < otpLength; i++) {
        OTP += otpChars[Math.floor(Math.random() * len)];
    }
    return OTP;
}

export default generateOTP;