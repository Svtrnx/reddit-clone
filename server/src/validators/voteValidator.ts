import Joi from 'joi';

export const votesSchema = Joi.object({
	thread: Joi.number().required()
});

export const votesThreadSchema = Joi.object({
	vote: Joi.number().optional(),
	
});

export const updateVoteSchema = Joi.object({
	params: votesSchema,
	body: votesThreadSchema
});