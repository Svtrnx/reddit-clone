import { Request } from 'express';

export interface UserPayload {
  userId: number;
}

export interface AuthenticatedRequest extends Request {
  user?: UserPayload;
}