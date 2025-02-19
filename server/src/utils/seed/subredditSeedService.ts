const axios = require("axios");
import { REDDIT_BASE_URL, SUBREDDITS_PATH } from "../../constans"
import { extractImageUrl } from "../utils"
const z = require('zod');

const SubredditSchema = z.object({
	public_description: z.string(),
	community_icon: z.string().optional(),
	icon_img: z.string().optional(),
	display_name_prefixed: z.string(),
	subscribers: z.number(),
	created_utc: z.number(),
})

const ThreadSchema = z.object({
	title: z.string(),
	author: z.string(),
	subreddit: z.string(),
	selftext: z.string(),
	ups: z.number(),
	num_comments: z.number(),
});

const RedditResponseSchema = z.object({
	data: z.object({
		children: z.array(z.object(
			{ data: SubredditSchema }
		)),
	}),
});

const RedditThreadResponseSchema = z.object({
	data: z.object({
	  children: z.array(z.object(
		  { data: ThreadSchema }
	  )),
	}),
});



export async function loadSubredditsData(after: string) {
	try {
		const response = await axios.get(`${REDDIT_BASE_URL}${SUBREDDITS_PATH}?limit=50&after=${after}`);
		const parsedData = RedditResponseSchema.parse(response.data);
		return parsedData.data.children.map((child: any) => ({
			description: child.data.public_description,
			image: extractImageUrl(child.data.community_icon && child.data.community_icon.length > 1 ? child.data.community_icon : child.data.icon_img),
			name: child.data.display_name_prefixed.replace(/^r\//, ''),
			subscribers: child.data.subscribers,
			created_utc: child.data.created_utc,
	  }));
	} catch (error) {
	  console.error("getSubreddits error:", error);
	  return [];
	}
}

export async function loadThreadsData(subredditUrl: string) {
	try {
		const response = await axios.get(`${REDDIT_BASE_URL}/r/${subredditUrl}.json?limit=100`);
		const parsedData = RedditThreadResponseSchema.parse(response.data);
		return parsedData.data.children.map((child: any) => ({
			title: child.data.title,
			author: child.data.author,
			subreddit: child.data.subreddit,
			text: child.data.selftext,
			votes: child.data.ups,
			num_comments: child.data.num_comments
		}));
	} catch (error) {
		console.error("getThreads error:", error);
		return [];
	}
}
