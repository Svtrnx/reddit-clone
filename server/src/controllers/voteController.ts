import { updateVoteSchema } from "../validators/voteValidator";
import { Request, Response } from 'express';
import prisma from '../models/prismaModel';

export const createOrUpdateVoteByThreadId = async (req: Request, res: Response): Promise<void> => {
	const { error, value } = updateVoteSchema.validate({ params: req.params, body: req.body }, { abortEarly: false });
  
	if (error) {
	  const errorMessages = error.details.map(detail => detail.message);
	  res.status(400).json({ errors: errorMessages });
	  return;
	}
  
	const { thread } = value.params;
	const { vote } = value.body;
	const user = (req as any).user;
  
	try {
	  const thread_ = await prisma.thread.findUnique({
		where: { id: thread },
	  });
  
	  if (!thread_) {
		res.status(404).json({ error: "Thread not found" });
		return;
	  }
	  const updatedVote = await prisma.vote.upsert({
		where: { thread_id: thread },
		update: {
		  value: vote,
		},
		create: {
		  thread_id: thread,
		  value: vote,
		  user_id: user.userId,
		},
	  });
  
	  res.status(200).json({vote: updatedVote });
	} catch (error: any) {
	  console.error("Error updating or creating vote:", error);
	  res.status(500).json({ error: "Error updating or creating vote", details: error.message });
	}
};