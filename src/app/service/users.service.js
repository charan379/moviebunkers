const { UserStatus } = require("../constants/UserStatus");
const {
  UserEmailAlreadyExists,
  UserNameAlreadyExists,
  JoiInvalidNewUser,
  JoiInvalidLogin,
  UserNameNotFound,
  InvalidUserPassword,
  JoiInvalidUserUpdate,
  UserNotFound,
  InactiveUser,
} = require("../errors/UserErrors");
const userRepository = require("../repository/user.repository");
const { generateHash, validateHash } = require("../utils/bcrypt");
const { buildSortObj } = require("../utils/build.sort.object");
const { UserException, MovieBunkersException } = require("../utils/Exceptions");
const { generateJwtToken } = require("../utils/jwt.token");
const {
  validateNewUser,
  validateLoginObject,
  validateUserUpdateObject,
} = require("../validators/user.validator");

/**
 * newUser Service function
 * @param {Object} requestBoby - newUser request body
 * @returns newUser Object with _id
 */
exports.newUser = async (requestBoby) => {
  /**
   * destructure value, error into {userDTO, error} from Joi object validation
   */
  const { value: userDTO, error: error } = await validateNewUser(requestBoby);

  /**
   * if Joi validation errors present then throw a new error of UserException instance
   */
  if (error) {
    throw new UserException(JoiInvalidNewUser(error.message));
  }

  /**
   * check if user with same userName already exists
   */
  if (await userRepository.findByUserName(userDTO.userName)) {
    /**
     * if user with same userName already exists then thorw new UserException
     */
    throw new UserException(UserNameAlreadyExists(userDTO.userName));
  }

  /**
   * check if user with same email already exists
   */
  if (await userRepository.findByEmail(userDTO.email)) {
    /**
     * if user with same email already exists then thorw new UserException
     */
    throw new UserException(UserEmailAlreadyExists(userDTO.email));
  }

  /** if above all condition passed then
   * hash the user password with bcrypt and
   * store it in hashedPassword variable
   */
  const hashedPassword = await generateHash(userDTO.password);

  /**
   * replace user password with password hash in userDTO
   * and create newUser with userDTO object
   * then await for result and return newUser object
   */
  return (newUser = await userRepository.newUser({
    ...userDTO,
    password: hashedPassword,
  }));
};

exports.findAll = async (requestQuery) => {
  let query = {};
  let sort = { createdAt: "desc" };
  let page = 1;
  let limit = 5;

  const nonQueryFields = ["sort_by", "page", "limit", "minimal"];

  query = { ...requestQuery };

  nonQueryFields.forEach((element) => {
    delete query[element];
  });

  // page
  if (requestQuery.page) {
    page = requestQuery.page;
  }

  // limit
  if (requestQuery.limit) {
    limit = requestQuery.limit;
  }

  // sort_by
  if (requestQuery.sort_by) {
    sort = await buildSortObj(requestQuery.sort_by);
  }

  const userList = await userRepository.findAllUsers(query, sort, page, limit);

  return userList;
};

exports.updateUser = async (userName, requestBoby) => {
  const { value: updateDTO, error: error } = await validateUserUpdateObject(
    requestBoby
  );

  if (error) {
    throw new UserException(JoiInvalidUserUpdate(error.message));
  }

  const user = await userRepository.findByUserName(userName);

  if (!user) {
    throw new UserException(UserNotFound(userName));
  }

  const result = await userRepository.updateUser(userName, updateDTO);
  return result;
};

exports.userLogin = async (requestBoby) => {
  /**
   * destructure value, error into {loginDTO, error} from Joi object validation
   */
  const { value: loginDTO, error: error } = await validateLoginObject(
    requestBoby
  );

  /**
   * if Joi validation errors present then throw a new error of UserException instance
   */
  if (error) {
    throw new UserException(JoiInvalidLogin(error.message));
  }

  /**
   * find user with given userName and store it in userDTO Variable
   */
  const userDTO = await userRepository.findByUserName(requestBoby.userName);

  /**
   * if userDTO is null then user Not found
   */
  if (userDTO === null) {
    throw new UserException(UserNameNotFound(requestBoby.userName));
  }

  if (userDTO.status === UserStatus.INACTIVE) {
    throw new UserException(InactiveUser(userDTO.userName));
  }

  /**
   * if user found then validate given password matches with passwordHash in db
   */
  if (!(await validateHash(requestBoby.password, userDTO.password))) {
    throw new UserException(InvalidUserPassword(requestBoby.userName));
  }

  /**
   * if all above conditions are passed then generate a valid jwt-token
   *
   */

  let token = await generateJwtToken({
    userName: userDTO.userName,
    email: userDTO.email,
    role: userDTO.role,
    status: userDTO.status,
  });

  /**
   * if all above conditions are passed then return Valid loginDetails with jwt-token of access
   *
   */
  return {token};
};
