/**
 * Enumeration of OTP types.
 * @readonly
 * @enum {string}
 */
enum OTPtype {
    NUMERIC = "numeric",
    ALPHA_NUMERIC_CASE_SMALL = "alphaNumericCaseSmall",
    ALPHA_NUMERIC_CASE_UP = "alphaNumericCaseUpper",
    ALPHA_CASE_UP = "alphaCaseUp",
    ALPHA_CASE_SMALL = "alphaCaseSmall",
    ALPHA_CASE_COMBINED = "alphaCaseCobmined",
    ALPHA_NUMERIC_CASE_COMBINED = "alphaNumericCaseCombined",
}

export default OTPtype;
