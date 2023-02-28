import Joi from "joi";
import UserRoles from "@constants/user.roles.enum";
import UserStatus from "@constants/user.status.enum";

export const userNameSchema: Joi.StringSchema = Joi.string().min(5).max(16).example("user00001");
export const emailSchema = Joi.string().email().example("user00001@gmail.com");

export const passwordSchema: Joi.StringSchema = Joi.string()
  .min(8)
  .max(16)
  .example("!5tr0ng@pa55w0rd");

export const userRegistrationSchema: Joi.ObjectSchema<any> = Joi.object({
  userName: userNameSchema.required(),
  email: emailSchema.required(),
  password: passwordSchema.required(),
  role: Joi.string().valid(UserRoles.USER),
  status: Joi.string().valid(UserStatus.ACTIVE),
});

export const findAllUserQuerySchema : Joi.ObjectSchema<any> = Joi.object({
  userName: userNameSchema,
  email: emailSchema,
  role: Joi.string().valid(...Object.values(UserRoles)),
  status: Joi.string().valid(...Object.values(UserStatus)),
  minimal: Joi.boolean(),
  page: Joi.number().integer().example(1),
  limit: Joi.number().integer().example(5),
  sort_by: Joi.string().example("role.desc"),
})