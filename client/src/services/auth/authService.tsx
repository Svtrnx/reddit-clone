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

const AuthenticateResponseSchema = z.object({
    message: z.string(),
    user: UserSchema,
});

const CreateUserResponseSchema = z.object({
    user: UserSchema,
});


export async function Authenticate(username: string, password: string) {
	try {	
		const response = await axios.post(`${SERVER_URL}users/auth`, 
			{ username, password }, 
			{ withCredentials: true }
		);
		const parsedData = AuthenticateResponseSchema.parse(response.data);
		console.log(parsedData);
		return parsedData;
	} catch (error) {
		console.error("Authentication failed:", error);
		throw error; 
	}
}


export async function CreateUser(username: string, password: string, email: string) {
	try {	
		const response = await axios.post(`${SERVER_URL}users`, 
			{ email, username, password }, 
			{ withCredentials: true }
		);
		const parsedData = CreateUserResponseSchema.parse(response.data);
		console.log(parsedData);
		return parsedData;
	} catch (error) {
		console.error("Authentication failed:", error);
		throw error; 
	}
}