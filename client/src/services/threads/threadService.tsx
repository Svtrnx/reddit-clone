import axios from "axios";
import { z } from 'zod';
import { SERVER_URL } from "@/constans";

const ThreadSchema = z.object({
	id: z.number(),
	title: z.string(),
	subreddit: z.string(),
	author: z.string(),
	content: z.string().optional(),
	votes: z.number(),
	vote: z.number(),
	num_comments: z.number(),
})

const RedditResponseSchema = z.object({
	threads: z.array(ThreadSchema),
});

export const fetchThreads = async (page: number, subreddit: string) => {
	try {
	  const response = await axios.get(`${SERVER_URL}threads?page=${page}&limit=9&subreddit=${subreddit}`, {
		withCredentials: true,
	  })
	  const data = RedditResponseSchema.parse(response.data)
	  return data
	} catch (error) {
	  console.error("Error fetching subreddits:", error)
	  throw error
	}
}

export const updateThreadVotes = async (thread: number, votes: number) => {
	try {
		await axios.put(`${SERVER_URL}threads/${thread}`, {"votes": votes}, {
			withCredentials: true,
		})
	} catch (error) {
	  console.error("Error fetching subreddits:", error)
	  throw error
	}
}