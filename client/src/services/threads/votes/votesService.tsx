import axios from "axios";
import { z } from 'zod';
import { SERVER_URL } from "@/constans";

const VoteSchema = z.object({
	id: z.number(),
	user_id: z.number(),
	thread_id: z.number(),
	value: z.number(),
	created_at: z.string(),
	updated_at: z.string(),
})

const VoteResponseSchema = z.object({
	vote: VoteSchema,
});

export const voteThread = async (thread: number, vote: number) => {
	try {
	  const response = await axios.post(`${SERVER_URL}votes/${thread}`, {"vote": vote}, {
		withCredentials: true,
	  })
	  const data = VoteResponseSchema.parse(response.data)
	  return data
	} catch (error) {
	  console.error("Error fetching subreddits:", error)
	  throw error
	}
}