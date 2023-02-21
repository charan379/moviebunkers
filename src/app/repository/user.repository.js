const UserModel = require("../models/user.model");

/**
 * find all users
 * @param {String} userName
 * @returns userObject or null
 */
exports.findAll = async ({query, sort, page, limit}) => {
  /**
   * key values to be retived
   */
  const projection = {
    password: 0,
    _id: 0,
    __v: 0,
  };

  // count of number of users found for given query
  const usersCount = await UserModel.find(query).countDocuments();

  // list of users found for given query
  const userList = await UserModel.find(query, projection)
    .limit(limit * 1) // number of usres to retrived per page
    .sort(sort) // {} // sort order of users
    .skip((page - 1) * limit); // number of results to be skipped

  // return retrived users list along with currentPage, totalPages, Array<user> list
  return {
    currentPage: page,
    totalPages: Math.ceil(usersCount / limit),
    list: userList,
  };
};

/**
 * find user by userName
 * @param {String} userName
 * @returns userObject or null
 */
exports.findByUserName = async (userName) => {
  //retun user document which is found for given userName
  return UserModel.findOne({ userName: userName });
};

/**
 * find user by email id
 * @param {String} email
 * @returns userObject or null
 */
exports.findByEmail = async (email) => {
    //retun user document which is found for given email
  return UserModel.findOne({ email: email });
};

/**
 * create new user in DB
 * @param {Object} userDTO
 * @returns created userOnbect
 */
exports.createUser = async (userDTO) => {
  // create new user with userDTO and return created document
  return UserModel.create(userDTO);
};

/**
 * update user with given update object {}
 * @param {*} userName userName index
 * @param {*} update object
 * @returns 
 */
exports.updateUser = async (userName, update) => {

  /**
   * key values to be retived
   */
  const projection = {
    password: 0,
    _id: 0,
    __v: 0,
  };

  /**
   * findOne user with given userName then update user
   */
  await UserModel.findOneAndUpdate({ userName: userName }, { $set: update });

  /**
   * after updating user , return the user document with given userName
   */
  return UserModel.findOne({ userName: userName }, projection);
};
