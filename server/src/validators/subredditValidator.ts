import Joi from 'joi';

export const createSubredditSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().min(1).max(512).optional(),
  avatar: Joi.string().min(1).max(512).optional(),
  members: Joi.number().optional(),
  created_utc: Joi.number().optional()
});

export const idSchema = Joi.object({
	id: Joi.number().min(0).max(99999).required()
});

export const subbredditsSchema = Joi.object({
	description: Joi.string().min(1).max(512).optional(),
	avatar: Joi.string().min(1).max(512).optional(),
	members: Joi.number().optional(),
	created_utc: Joi.number().optional()
});

export const updateSubredditSchema = Joi.object({
	params: idSchema,
	body: subbredditsSchema
});