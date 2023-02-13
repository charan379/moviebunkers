const userRepository = require("../repository/user.repository");
const { generateHash, validateHash } = require("../utils/bcrypt");
const { UserException } = require("../utils/Exceptions");
const { generateJwtToken } = require("../utils/jwt.token");
const {
  validateNewUser,
  validateLoginObject,
} = require("../validators/user.validator");

/**
 * newUser Service function
 * @param {Object} requestBoby - newUser request body
 * @returns newUser Object with _id
 */
exports.newUserService = async (requestBoby) => {
  /**
   * destructure value, error into {userDTO, error} from Joi object validation
   */
  const { value: userDTO, error: error } = await validateNewUser(requestBoby);

  /**
   * if Joi validation errors present then throw a new error of UserException instance
   */
  if (error) {
    throw new UserException(error.message);
  }

  /**
   * check if user with same userName already exists
   */
  if (await userRepository.findByUserName(userDTO.userName)) {
    /**
     * if user with same userName already exists then thorw new UserException
     */
    throw new UserException(
      "User already exists with userName : " + userDTO.userName
    );
  }

  /**
   * check if user with same email already exists
   */
  if (await userRepository.findByEmail(userDTO.email)) {
    /**
     * if user with same email already exists then thorw new UserException
     */
    throw new UserException(
      "User already exists with email : " + userDTO.email
    );
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

exports.userLoginService = async (requestBoby) => {
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
    throw new UserException(error.message);
  }

  /**
   * find user with given userName and store it in userDTO Variable
   */
  const userDTO = await userRepository.findByUserName(requestBoby.userName);

  /**
   * if userDTO is null then user Not found
   */
  if (userDTO === null) {
    throw new UserException(
      "No User found with userName : " + requestBoby.userName
    );
  }

  /**
   * if user found then validate given password matches with passwordHash in db
   */
  if (!(await validateHash(requestBoby.password, userDTO.password))) {
    throw new UserException(
      "Given password is Invalid for userName : " + requestBoby.userName
    );
  }

  /**
   * if all above conditions are passed then generate a valid jwt-token 
   *
   */

    let token = await generateJwtToken({userName: userDTO.userName, email: userDTO.email, role: userDTO.role})

  /**
   * if all above conditions are passed then return Valid loginDetails with jwt-token of access
   *
   */
  return (loginDetails = {
    userName: userDTO.userName,
    email: userDTO.email,
    role: userDTO.role,
    token: token,
  });
};
