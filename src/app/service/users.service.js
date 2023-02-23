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
const {
  validateGetAllUsersQueryObject,
} = require("../validators/getAllUsers.validator");
const userRepository = require("../repository/user.repository");
const { generateHash, validateHash } = require("../utils/bcrypt");
const { buildSortObj } = require("../utils/build.sort.object");
const { UserException, MovieException } = require("../utils/Exceptions");
const { generateJwtToken } = require("../utils/jwt.token");
const {
  validateNewUser,
  validateLogin,
  validateUserUpdate,
} = require("../validators/user.validator");
const { InvalidQuery } = require("../errors/CommonErrors");

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
  return (newUser = await userRepository.createUser({
    ...userDTO,
    password: hashedPassword,
  }));
};

/**
 * findAll users based on given query
 * @param {Object} requestQuery
 * @returns
 */
exports.findAll = async (requestQuery) => {
  /**
   * default values
   */
  let query = {}; // query object
  let sort = { createdAt: "desc" }; // sort object
  let page = 1; // page number to to retrived
  let limit = 5; // number of results to retirved per page

  /**
   * validate request query
   */
  let { value: queryDTO, error: error } = await validateGetAllUsersQueryObject(
    requestQuery
  );
  /**
   * if any errors in request query then throw error
   */
  if (error) {
    throw new MovieException(InvalidQuery(error.message));
  }
  /**
   * non query fields ( non keys ) of user document which will come with request query
   */
  const nonQueryFields = ["sort_by", "page", "limit", "minimal"];

  /**
   * copy requestQuery to query
   */
  query = { ...queryDTO };

  /**
   * remove all non query fields (non-keys) form query object {}
   */
  nonQueryFields.forEach((element) => {
    //delete key
    delete query[element];
  });

  /**
   * if page value provided in requestQuery
   */
  if (queryDTO.page) {
    page = queryDTO.page; // change default page number
  }

  /**
   * if limit value provided in requestQuery
   */
  if (queryDTO.limit) {
    limit = queryDTO.limit; // change default limit value
  }

  /**
   * if sort options are provided in requestQuery
   */
  if (queryDTO.sort_by) {
    /**
     * retrive sort option as an object
     * and
     * change the sort value with retived sort object
     */
    sort = await buildSortObj(queryDTO.sort_by);
  }

  /**
   * finally find all users with query, sort options , page, limit and retrun
   * Array<Users>
   */
  return await userRepository.findAll({ query, sort, page, limit });
};

/**
 * find user details by user name
 * @param {string} userName
 * @returns
 */
exports.findUserDetails = async (userName) => {
  const userDetails = await userRepository.findByUserName(userName, {
    password: 0,
  });
  if (!userDetails) {
    throw new UserException(UserNotFound(userName));
  }

  return userDetails;
};
/**
 * update user
 * @param {string} userName
 * @param {Object} requestBoby
 * @returns
 */
exports.updateUser = async (userName, requestBoby, authentication) => {
  /**
   * validate request body using joi validators
   * if it was as requried
   * store cleaned requestBody in updateDTO,
   * if there were any any errors store in error variable
   */
  let { value: updateDTO, error: error } = await validateUserUpdate(
    requestBoby
  );

  /**
   * if there were any errors then throw exception
   */
  if (error) {
    throw new UserException(JoiInvalidUserUpdate(error.message));
  }

  /**
   * if no errors were thrown
   * find if user with given userName really exists in our DB , and store in user variable
   */
  const user = await userRepository.findByUserName(userName);

  /**
   * if user not found , then throw exception
   */
  if (!user) {
    throw new UserException(UserNotFound(userName));
  }

  /**
   * append titleDTO with last_modified_by userName
   */
  updateDTO = { ...updateDTO, last_modified_by: authentication.userName };
  /**
   * if user found and no erros were thrown then update user
   * and
   * return updated user object
   */
  return await userRepository.updateUser(userName, updateDTO);
};

/**
 * user login
 * @param {Object} requestBoby
 * @returns
 */
exports.userLogin = async (requestBoby) => {
  /**
   * destructure value, error into {loginDTO, error} from Joi object validation
   */
  const { value: loginDTO, error: error } = await validateLogin(requestBoby);

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

  /**
   * if user found then validate given password matches with passwordHash in db
   */
  if (!(await validateHash(requestBoby.password, userDTO.password))) {
    throw new UserException(InvalidUserPassword(requestBoby.userName));
  }

  /**
   * if retrived user status is Inactive then thrown exception
   */
  if (userDTO.status !== UserStatus.ACTIVE) {
    throw new UserException(InactiveUser(userDTO.userName+ " : "+ userDTO.status));
  }

  /**
   * if all above conditions are passed then generate a valid jwt-token
   *
   */
  const token = await generateJwtToken({
    userName: userDTO.userName,
    // email: userDTO.email,
    // role: userDTO.role,
    // status: userDTO.status,
  });

  /**
   * if all above conditions are passed then return Valid loginDetails with jwt-token of access
   *
   */
  return { token };
};
