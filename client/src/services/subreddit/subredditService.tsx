import axios from "axios";
import { z } from 'zod';
import { SERVER_URL } from "@/constans";

const SubredditSchema = z.object({
	id: z.number(),
	avatar: z.string(),
	description: z.string(),
	members: z.number(),
	name: z.string(),
	subscribed: z.boolean().optional().default(false),
	created_at: z.string(),
	updated_at: z.string(),
	created_utc: z.number(),
})

const RedditResponseSchema = z.object({
	subreddits: z.array(SubredditSchema),
});

export const fetchSubreddits = async (page: number) => {
	try {
	  const response = await axios.get(`${SERVER_URL}subreddits?page=${page}&limit=10`, {
		withCredentials: true,
	  })
	  const data = RedditResponseSchema.parse(response.data)
	  return data
	} catch (error) {
	  console.error("Error fetching subreddits:", error)
	  throw error
	}
}

export const fetchSubreddit = async (subredditId: number) => {
	try {
	  const response = await axios.get(`${SERVER_URL}subreddits/${subredditId}`, {
		withCredentials: true,
	  })
	  const data = SubredditSchema.parse(response.data)
	  return data
	} catch (error) {
	  console.error("Error fetching subreddits:", error)
	  throw error
	}
}

export const subscribeToSubreddit = async (id: number | undefined) => {
	try {
	  const response = await axios.post(`${SERVER_URL}subreddits/subscribe/${id}`, {}, {
		withCredentials: true,
	  })
	  return response.data
	} catch (error) {
	  console.error("Error fetching subreddits:", error)
	  throw error
	}
}



