import Joi from 'joi';

export const createThreadSchema = Joi.object({
	subreddit: Joi.string().required(),
	author: Joi.string().min(1).max(256).required(),
	title: Joi.string().min(1).max(512).required(),
	content: Joi.string().optional(),
	votes: Joi.number().required(),
	num_comments: Joi.number().required()
});

export const voteSchema = Joi.object({
	thread: Joi.number().required()
});

export const voteThreadSchema = Joi.object({
	votes: Joi.number().optional(),
	
});

export const updateVotesSchema = Joi.object({
	params: voteSchema,
	body: voteThreadSchema
});