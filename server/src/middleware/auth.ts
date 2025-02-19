import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import { UserPayload } from '../types';

export const authenticateToken = (
	req: Request, 
	res: Response, 
	next: NextFunction
  ): void => {
	const token = req.cookies.token || req.headers['authorization']?.split(' ')[1];
  
	if (!token) {
	  res.sendStatus(401);
	  return;
	}
  
	try {
	  const user = verifyToken(token) as UserPayload;
	  (req as any).user = user;
	  next();
	} catch (error) {
	  res.sendStatus(403);
	}
  };