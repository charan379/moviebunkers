const UserModel = require("../models/user.model");

/**
 * find user by userName
 * @param {String} userName
 * @returns userObject or null
 */
exports.findByUserName = async (userName) => {
  return UserModel.findOne({ userName: userName });
};

/**
 * find user by email id
 * @param {String} email
 * @returns userObject or null
 */
exports.findByEmail = async (email) => {
  return UserModel.findOne({ email: email });
};

/**
 * create new user in DB
 * @param {Object} userDTO
 * @returns created userOnbect
 */
exports.newUser = async (userDTO) => {
  return UserModel.create(userDTO);
};
