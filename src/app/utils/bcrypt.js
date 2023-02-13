const bcrypt = require("bcrypt");

const saltRounds = 10;

/**
 * Generates bcrypt hash
 * @param {String} plainText - text to be hashed
 * @returns hashed string
 */
const generateHash = async (plainText) => {
  return new Promise((resolve, reject) => {
    bcrypt
      .hash(plainText, saltRounds)
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

/**
 * Validate Hash with text
 * @param {String} plainText 
 * @param {Hash} hash 
 * @returns true or false within a promise
 */
const validateHash = async (plainText, hash) => {
  return new Promise((resolve, reject) => {
    bcrypt
      .compare(plainText, hash)
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

module.exports = { generateHash, validateHash };
