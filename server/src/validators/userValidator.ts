import Joi from 'joi';

export const createUserSchema = Joi.object({
  email: Joi.string().email().required(),
  username: Joi.string()
    .min(5)
    .max(64)
    .pattern(/^[a-zA-Z0-9_]+$/)
    .message("Username must contain only letters, numbers, and underscores")
    .required(),
  password: Joi.string()
    .min(6)
    .max(128)
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/)
    .message("Password must contain at least one uppercase letter, one lowercase letter, and one number")
    .required(),
  subscribed_subreddits: Joi.array().items(Joi.number()).optional(),
})

export const loginSchema = Joi.object({
  username: Joi.string()
    .min(5)
    .max(64)
    .pattern(/^[a-zA-Z0-9_]+$/)
    .message("Username must contain only letters, numbers, and underscores")
    .required(),
  password: Joi.string()
    .min(6)
    .max(128)
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/)
    .message("Password must contain at least one uppercase letter, one lowercase letter, and one number")
    .required(),
})



export const usernameSchema = Joi.object({
	username: Joi.string().min(3).max(64).required()
});

export const emailSubbredditsSchema = Joi.object({
	email: Joi.string().email().optional(),
	subscribed_subreddits: Joi.array().items(Joi.number()).optional()
});

export const updateUserSchema = Joi.object({
	params: usernameSchema,
	body: emailSubbredditsSchema
});