import { Request, Response } from 'express';
import prisma from '../models/prismaModel';

export async function healthCheck(req: Request, res: Response) {
	try {
		await prisma.$queryRaw`SELECT 1`;
		res.status(200).json({ status: 'Healthy' });
	} catch(error: any) {
		console.error("Database connection error:", error);
		res.status(500).json({ error: "Database connection failed", details: error.message });
	}

}