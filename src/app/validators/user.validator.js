const Joi = require("joi");

// newUser schema

const newUserSchema = Joi.object({
  userName: Joi.string().min(5).max(16).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).max(16).required(),
  role: Joi.string().required(),
});

exports.validateNewUser = async (userDTO)=>{
    return newUserSchema.validate(userDTO, {abortEarly: false, stripUnknown: true})
}