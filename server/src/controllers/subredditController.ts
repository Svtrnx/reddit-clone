import { Request, Response } from 'express';
import prisma from '../models/prismaModel';
import { idSchema, createSubredditSchema, updateSubredditSchema } from '../validators/subredditValidator';
import { loadSubredditsData, loadThreadsData } from '../utils/seed/subredditSeedService';


export const subscribeSubredditToUser = async (req: Request, res: Response): Promise<void> => {
	try {
	  const { error, value } = idSchema.validate(req.params)
	  if (error) {
		res.status(400).json({ error: error.details[0].message })
		return
	  }

	  const user = (req as any).user;

    if (!user || !user.userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
  
	  const { id } = value

    const currentUser = await prisma.user.findUnique({
      where: { id: user.userId },
      select: { subscribed_subreddits: true }
    });

    const currentSubreddits = currentUser && currentUser.subscribed_subreddits || [];
    const isSubscribed = currentSubreddits.includes(id);

    const newSubreddits = isSubscribed
      ? currentSubreddits.filter(subId => subId !== id) // Remove
      : [...currentSubreddits, id]; // Add

      await prisma.user.update({
        where: { id: user.userId },
        data: {
          subscribed_subreddits: {
            set: newSubreddits
          }
        }
      });
  
      const action = isSubscribed ? 'Unsubscribed from' : 'Subscribed to';
      res.status(200).json({ success: `${action} subreddit (${id}) successfully` });
	} catch (error) {
	  console.error(error)
	  res.status(500).json({ error: "Error creating subreddit" })
	}
}

export const createSubreddit = async (req: Request, res: Response): Promise<void> => {
  try {
    const { error, value } = createSubredditSchema.validate(req.body)
    if (error) {
      res.status(400).json({ error: error.details[0].message })
      return
    }

    const { name, description, avatar, members, created_utc } = value

    const existingSubreddit = await prisma.subreddit.findFirst({
      where: {
        name,
      },
      select: {
        id: true,
        name: true
      }
    })

    if (existingSubreddit && existingSubreddit.name === name) {
      res.status(400).json({ error: "Subreddit Already Exists" })
      return
    }

    



    const subreddit = await prisma.subreddit.create({
      data: {
        name,
        description,
        avatar,
        members,
        created_utc,
      },
    })

    res.status(201).json({subreddit: subreddit})
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Error creating subreddit" })
  }
}

export const getAllSubreddits = async (req: Request, res: Response) => {
  try {
    const page = Number.parseInt(req.query.page as string) || 1
    const limit = Number.parseInt(req.query.limit as string) || 25
    const skip = (page - 1) * limit

    const [subreddits] = await Promise.all([
      prisma.subreddit.findMany({
        select: {
          id: true,
          name: true,
          description: true,
          avatar: true,
          members: true,
          created_at: true,
          updated_at: true,
          created_utc: true,
        },
        orderBy: [
          { created_at: "desc" },
          { id: "desc" }
        ],
        skip,
        take: limit,
      }),
      prisma.subreddit.count(),
    ])

    res.status(200).json({
      subreddits,
    })
  } catch (error: any) {
    console.error("Error fetching subreddits:", error)
    res.status(500).json({ error: "Error fetching subreddits", details: error.message })
  }
}

export const getSubredditById = async (req: Request, res: Response): Promise<void> => {

  const { error, value } = idSchema.validate(req.params)
  if (error) {
    res.status(400).json({ error: error.details[0].message })
    return;
  }
  const { id } = value;

  try {
    const subreddit = await prisma.subreddit.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        description: true,
        avatar: true,
        members: true,
        created_at: true,
        updated_at: true,
        created_utc: true,
      },
    });

    if (!subreddit) {
      res.status(404).json({ error: "Subreddit not found" });
      return;
    }

    res.status(200).json(subreddit);
  } catch (error: any) {
    console.error("Error fetching subreddit:", error);
    res.status(500).json({ error: "Error fetching subreddit", details: error.message });
  }
};

export const updateSubredditById = async (req: Request, res: Response): Promise<void> => {
  
  const { error, value } = updateSubredditSchema.validate({ params: req.params, body: req.body }, { abortEarly: false });

  if (error) {
    const errorMessages = error.details.map(detail => detail.message);
    res.status(400).json({ errors: errorMessages });
    return;
  }

  const { id } = value.params;
  const { description, avatar, members } = value.body;

  try {
    const subreddit = await prisma.subreddit.findUnique({
      where: { id },
      select: {
        name: true,
        description: true,
        avatar: true,
        members: true,
      }
    });

    if (!subreddit) {
      res.status(404).json({ error: "Subreddit not found" });
      return;
    }

    const updatedSubreddit = await prisma.subreddit.update({
      where: { id },
      data: {
        description: description || subreddit.description,
        avatar: avatar || subreddit.avatar,
        members: members || subreddit.members,
        updated_at: new Date().toISOString(),
      },
    });

    res.status(200).json(updatedSubreddit);
  } catch (error: any) {
    console.error("Error updating subreddit:", error);
    res.status(500).json({ error: "Error updating subreddit", details: error.message });
  }
};

export const deleteSubredditById = async (req: Request, res: Response): Promise<void> => {
  const { error, value } = idSchema.validate(req.params)
  if (error) {
    res.status(400).json({ error: error.details[0].message })
    return;
  }
  const { id } = value;

  try {
    const subreddit = await prisma.subreddit.findUnique({
      where: { id },
    });

    if (!subreddit) {
      res.status(404).json({ error: "Subreddit not found" });
      return;
    }

    await prisma.subreddit.delete({
      where: { id },
    });

    res.status(200).json({ message: "Subreddit deleted successfully" });
  } catch (error: any) {
    console.error("Error deleting subreddit:", error);
    res.status(500).json({ error: "Error deleting subreddit", details: error.message });
  }
};

export const seedSubreddits = async (req: Request, res: Response): Promise<void> => {
  try {
    const after = req.query.after ? (req.query.after as string) : "";
    const subreddits = await loadSubredditsData(after);

    for (const subreddit of subreddits) {
      try {
        await prisma.subreddit.upsert({
          where: { name: subreddit.name },
          update: {},
          create: {
            name: subreddit.name,
            description: subreddit.description,
            avatar: subreddit.image,
            members: subreddit.subscribers,
            created_utc: subreddit.created_utc,
          },
        });

        const threads = await loadThreadsData(subreddit.name);
        
        const existingThreads = await prisma.thread.findMany({
          where: {
            OR: threads.map((thread: any) => ({
              title: thread.title,
              subreddit: thread.subreddit,
            }))
          },
          select: {
            title: true,
            subreddit: true,
          }
        });
        
        const existingThreadSet = new Set(
          existingThreads.map((t) => `${t.title}-${t.subreddit}`)
        );
        
        const threadsToCreate = threads
          .filter((thread: any) => 
            thread.title && 
            thread.author && 
            thread.subreddit && 
            thread.votes !== undefined &&
            !existingThreadSet.has(`${thread.title}-${thread.subreddit}`)
          )
          .map((thread: any) => ({
            title: thread.title,
            author: thread.author,
            subreddit: thread.subreddit,
            content: thread.text,
            votes: thread.votes,
            num_comments: thread.num_comments
          }));
        
        if (threadsToCreate.length > 0) {
          await prisma.thread.createMany({
            data: threadsToCreate,
          });
        }

        console.log(`Processed subreddit: ${subreddit.name}, inserted ${threadsToCreate.length} new threads`);
      } catch (subredditError) {
        console.error(`Error processing subreddit ${subreddit.name}: ${subredditError}`);
      }
    }

    res.status(200).json({ message: "Seeding completed successfully" });
  } catch (error: any) {
    console.error("Error deleting subreddit:", error);
    res.status(500).json({ error: "Error deleting subreddit", details: error.message });
  }
};