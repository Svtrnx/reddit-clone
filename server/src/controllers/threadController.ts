import { Request, Response } from 'express';
import prisma from '../models/prismaModel';
import { updateVotesSchema, createThreadSchema } from '../validators/threadValidator';
import { idSchema } from '../validators/subredditValidator';


export const createThread = async (req: Request, res: Response): Promise<void> => {
  try {
    const { error, value } = createThreadSchema.validate(req.body)
    if (error) {
      res.status(400).json({ error: error.details[0].message })
      return
    }

    const user = (req as any).user

    const { subreddit, author, title, content, votes, num_comments } = value

    const existingThread = await prisma.thread.findFirst({
      where: {
        subreddit,
        author,
        title,
      },
    })

    if (existingThread) {
      res.status(404).json({ error: "Thread already exists" });
      return;
    }

    const existingSubreddit = await prisma.subreddit.findFirst({
      where: {
        name: subreddit,
      },
      select: {
        id: true,
        name: true
      }
    })
    
    if (existingSubreddit) {
      const userData = await prisma.user.findFirst({
        where: {
          id: user.userId,
        },
        select: {
          subscribed_subreddits: true
        }
      })
      
      // Check if user subscribed to subreddit
      if (!userData?.subscribed_subreddits.includes(existingSubreddit ? existingSubreddit.id : 0)) {
        res.status(404).json({ error: "You are not subscribed to this subreddit" })
        return
      }

      const thread = await prisma.thread.create({
        data: {
          subreddit, 
          author, 
          title, 
          content, 
          votes, 
          num_comments
        },
      })
  
      res.status(201).json({thread: thread})
    }
    else {
      res.status(404).json({ error: "Subreddit not found" })
      return
    }
    
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Error creating thread" })
  }
}


export const getAllThreads = async (req: Request, res: Response) => {
  try {
    const page = Number.parseInt(req.query.page as string) || 1
    const limit = Number.parseInt(req.query.limit as string) || 25
    const skip = (page - 1) * limit
    const subreddit = req.query.subreddit as string | undefined

    const whereClause = subreddit ? { subreddit: subreddit } : {}

    const [threads] = await Promise.all([
      prisma.thread.findMany({
        where: whereClause,
        select: {
          id: true,
          subreddit: true,
          author: true,
          title: true,
          content: true,
          votes: true,
          created_at: true,
          updated_at: true,
          num_comments: true
        },
        orderBy: [{ created_at: "desc" }, { id: "desc" }],
        skip,
        take: limit,
      }),
      prisma.thread.count({ where: whereClause }),
    ])

    const threadsWithVoteStatus = await Promise.all(
      threads.map(async (thread) => {
        const votes = await prisma.vote.findMany({
          where: { thread_id: thread.id },
          select: { value: true, user_id: true },
        })

        const vote = votes.reduce((sum, vote) => sum + vote.value, 0)

        return {
          id: thread.id,
          subreddit: thread.subreddit,
          author: thread.author,
          title: thread.title,
          content: thread.content,
          votes: thread.votes,
          vote,
          created_at: thread.created_at,
          updated_at: thread.updated_at,
          num_comments: thread.num_comments
        }
      }),
    )

    res.status(200).json({
      threads: threadsWithVoteStatus,
    })
  } catch (error: any) {
    console.error("Error fetching threads:", error)
    res.status(500).json({ error: "Error fetching threads", details: error.message })
  }
}

export const getThreadById = async (req: Request, res: Response): Promise<void> => {

  const { error, value } = idSchema.validate(req.params)
  if (error) {
    res.status(400).json({ error: error.details[0].message })
    return;
  }
  const { id } = value;

  try {
    const thread = await prisma.thread.findUnique({
      where: { id },
      select: {
        id: true,
        subreddit: true,
        author: true,
        title: true,
        content: true,
        votes: true,
        created_at: true,
        updated_at: true,
        num_comments: true
      },
    });

    if (!thread) {
      res.status(404).json({ error: "Thread not found" });
      return;
    }

    res.status(200).json(thread);
  } catch (error: any) {
    console.error("Error fetching thread:", error);
    res.status(500).json({ error: "Error fetching subreddit", details: error.message });
  }
};

export const updateThreadVotes = async (req: Request, res: Response): Promise<void> => {
	const { error, value } = updateVotesSchema.validate({ params: req.params, body: req.body }, { abortEarly: false });
  
	if (error) {
	  const errorMessages = error.details.map(detail => detail.message);
	  res.status(400).json({ errors: errorMessages });
	  return;
	}
  
	const { thread } = value.params;
	const { votes } = value.body;
  
  
	try {
	  const thread_ = await prisma.thread.findUnique({
		where: { id: thread },
	  });
  
	  if (!thread_) {
		res.status(404).json({ error: "Thread not found" });
		return;
	  }
	  const updatedThread = await prisma.thread.update({
		where: { id: thread },
      data: {
        votes: votes,
      }
    });
  
	  res.status(200).json({thread: updatedThread });
	} catch (error: any) {
	  console.error("Successfully updated votes:", error);
	  res.status(500).json({ error: "Error to update votes", details: error.message });
	}
};

export const deleteThreadById = async (req: Request, res: Response): Promise<void> => {
  const { error, value } = idSchema.validate(req.params)
  if (error) {
    res.status(400).json({ error: error.details[0].message })
    return;
  }
  const { id } = value;

  try {
    const thread = await prisma.user.findUnique({
      where: { id },
    });

    if (!thread) {
      res.status(404).json({ error: "Thread not found" });
      return;
    }

    await prisma.thread.delete({
      where: { id },
    });

    res.status(200).json({ message: "Thread deleted successfully" });
  } catch (error: any) {
    console.error("Error deleting thread:", error);
    res.status(500).json({ error: "Error deleting thread", details: error.message });
  }
};