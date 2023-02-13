const userRepository = require("../repository/user.repository");
const { generateHash } = require("../utils/bcrypt");
const { UserException } = require("../utils/Exceptions");
const { validateNewUser } = require("../validators/user.validator");


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
    throw new UserException(error.message);
  }

  /**
   * check if user with same userName already exists
   */
  if(await userRepository.findByUserName(userDTO.userName)){
    /**
     * if user with same userName already exists then thorw new UserException
     */
    throw new UserException('User already exists with userName : '+ userDTO.userName)
  }

  /**
   * check if user with same email already exists
   */
  if(await userRepository.findByEmail(userDTO.email)){
    /**
     * if user with same email already exists then thorw new UserException
     */
    throw new UserException('User already exists with email : '+ userDTO.email)
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
  return newUser = await userRepository.newUser({
    ...userDTO,
    password: hashedPassword,
  });
};
