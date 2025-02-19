import axios from "axios";
import { SERVER_URL } from "../../constans"
import { z } from 'zod';

const UserSchema = z.object({
    id: z.number(),
    email: z.string().email(),
    username: z.string(),
    subscribed_subreddits: z.array(z.number()),
    created_at: z.string(),
    updated_at: z.string(),
});

const UserResponseSchema = z.object({
    user: UserSchema,
});



export async function GetCurrentUser() {
	try {	
		const response = await axios.get(`${SERVER_URL}users/me`,  
			{ withCredentials: true }
		);
		const parsedData = UserResponseSchema.parse(response.data);
		return parsedData;
	} catch (error) {
		console.error("Authentication failed:", error);
		throw error; 
	}
}
