const UserModel = require("../models/user.model");

/**
 * find all users
 * @param {String} userName
 * @returns userObject or null
 */
exports.findAllUsers = async (query, page, limit) => {
  const projection = {
    password: 0,
    _id: 0,
    __v: 0,
  };

  const usersCount = await UserModel.find(query).countDocuments();

  const userList = await UserModel.find(query, projection)
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const result = {
    currentPage: page,
    totalPages: Math.ceil(usersCount / limit),
    list: userList,
  };
  return result;
};

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
