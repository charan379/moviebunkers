import Joi from "joi";
import UserRoles from "@constants/user.roles.enum";
import UserStatus from "@constants/user.status.enum";
import IUser from "@models/interfaces/user.interface";
import { UserPasswordResetRequestBody, VerifyUserRequestBody } from "src/@types";

export const userNameSchema: Joi.StringSchema = Joi.string().min(5).max(22).example("user00001");
export const emailSchema: Joi.StringSchema = Joi.string().email().example("user00001@gmail.com");

export const passwordSchema: Joi.StringSchema = Joi.string()
  .min(8)
  .max(26)
  .regex(/((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W]).{8,26})/)
  .example("!5tr0ng@pa55w0rd");

export const userRegistrationSchema: Joi.ObjectSchema<IUser> = Joi.object({
  userName: userNameSchema.required(),
  email: emailSchema.required(),
  password: passwordSchema.required(),
});

export const newUserSchema: Joi.ObjectSchema<IUser> = Joi.object({
  userName: userNameSchema.required(),
  email: emailSchema.required(),
  password: passwordSchema.required(),
  role: Joi.string().valid(UserRoles.USER, UserRoles.GUEST),
  status: Joi.string().valid(UserStatus.ACTIVE, UserStatus.INACTIVE),
});

export const findAllUserQuerySchema: Joi.ObjectSchema<any> = Joi.object({
  userName: Joi.string().allow(null).allow(""),
  email: Joi.string().allow(null).allow(""),
  role: Joi.string().valid(...Object.values(UserRoles)),
  status: Joi.string().valid(...Object.values(UserStatus)),
  minimal: Joi.boolean(),
  page: Joi.number().integer().example(1),
  limit: Joi.number().integer().example(5),
  sort_by: Joi.string().example("role.desc"),
})

export const userUpdateSchema: Joi.ObjectSchema<IUser> = Joi.object({
  status: Joi.string().valid(...Object.values(UserStatus)),
  role: Joi.string().valid(...[UserRoles.GUEST, UserRoles.USER, UserRoles.MODERATOR]),
});

export const loginSchema: Joi.ObjectSchema<IUser> = Joi.object({
  userName: userNameSchema.required(),
  password: passwordSchema.required(),
})

export const msAdmUpdatePassSchema: Joi.ObjectSchema<Partial<IUser>> = Joi.object({
  userName: userNameSchema.required(),
  password: passwordSchema.required()
})

export const resetUserPasswordSchema: Joi.ObjectSchema<UserPasswordResetRequestBody> = Joi.object({
  userName: userNameSchema.required(),
  newPassword: passwordSchema.required(),
  otp: Joi.string().required(),
})

export const verifyUserSchema: Joi.ObjectSchema<VerifyUserRequestBody> = Joi.object({
  userName: userNameSchema.required(),
  otp: Joi.string().required(),
})