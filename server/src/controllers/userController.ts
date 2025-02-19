import { Request, Response } from 'express';
import prisma from '../models/prismaModel';
const bcrypt = require('bcryptjs');
import jwt from 'jsonwebtoken';
import { createUserSchema, loginSchema, usernameSchema, updateUserSchema } from '../validators/userValidator';

const JWT_SECRET = process.env.JWT_SECRET || '';

export const createUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { error, value } = createUserSchema.validate(req.body)
    if (error) {
      res.status(400).json({ error: error.details[0].message })
      return
    }

    const { email, username, password, subscribed_subreddits } = value

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    })

    if (existingUser) {
      if (existingUser.email === email || existingUser.username === username) {
        res.status(400).json({ error: "User Already Exists" })
      }
      return
    }

    const saltRounds = 10
    const hashedPassword = await bcrypt.hash(password, saltRounds)

    const user = await prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
        subscribed_subreddits,
      },
    })

    const { password: _, ...userWithoutPassword } = user
    res.status(201).json({user: userWithoutPassword})
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Error creating user" })
  }
}

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { error, value } = loginSchema.validate(req.body)
    if (error) {
      res.status(400).json({ error: error.details[0].message })
      return
    }

    const { username, password } = value

    const user = await prisma.user.findUnique({ where: { username } })

    if (!user) {
      res.status(401).json({ error: "Invalid username or password" })
      return
    }
    
    const isPasswordValid = await bcrypt.compare(password, user.password ? user.password : '')

    if (!isPasswordValid) {
      res.status(401).json({ error: "Invalid username or password" })
      return
    }

    const { password: _, ...userWithoutPassword } = user
    
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });

    res.cookie('token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds
    });

    res.status(200).json({ message: "Login successful", user: userWithoutPassword })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Error during login" })
  }
}

export const getCurrentUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;

    if (!user || !user.userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const userData = await prisma.user.findUnique({
      where: { id: user.userId },
      select: {
        id: true,
        email: true,
        username: true,
        subscribed_subreddits: true,
        created_at: true,
        updated_at: true,
      },
    });

    if (!userData) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.status(200).json({user: userData});
  } catch (error: any) {
    console.error("Error fetching current user:", error);
    res.status(500).json({ error: "Error fetching current user", details: error.message });
  }
};

export const getUserByUsername = async (req: Request, res: Response): Promise<void> => {

  const { error, value } = usernameSchema.validate(req.params)
  if (error) {
    res.status(400).json({ error: error.details[0].message })
    return;
  }
  const { username } = value;

  try {
    const user = await prisma.user.findUnique({
      where: { username },
      select: {
        email: true,
        username: true,
        subscribed_subreddits: true,
        created_at: true,
      },
    });

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.status(200).json(user);
  } catch (error: any) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Error fetching user", details: error.message });
  }
};

export const deleteUserByUsername = async (req: Request, res: Response): Promise<void> => {
  const { error, value } = usernameSchema.validate(req.params)
  if (error) {
    res.status(400).json({ error: error.details[0].message })
    return;
  }
  const { username } = value;

  try {
    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    await prisma.user.delete({
      where: { username },
    });

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error: any) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Error deleting user", details: error.message });
  }
};

export const updateUserByUsername = async (req: Request, res: Response): Promise<void> => {
  
  const { error, value } = updateUserSchema.validate({ params: req.params, body: req.body }, { abortEarly: false });

  if (error) {
    const errorMessages = error.details.map(detail => detail.message);
    res.status(400).json({ errors: errorMessages });
    return;
  }

  const { username } = value.params;
  const { email, subscribed_subreddits } = value.body;

  try {
    const user = await prisma.user.findUnique({
      where: { username },
      select: {
        email: true,
        username: true,
        subscribed_subreddits: true,
        created_at: true,
        updated_at: true,
      }
    });

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    const updatedUser = await prisma.user.update({
      where: { username },
      data: {
        email: email || user.email,
        subscribed_subreddits: subscribed_subreddits || user.subscribed_subreddits,
        updated_at: new Date().toISOString(),
      },
    });

    const { password, ...userWithoutPassword } = updatedUser;

    res.status(200).json(userWithoutPassword);
  } catch (error: any) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Error updating user", details: error.message });
  }
};

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        email: true,
        username: true,
        subscribed_subreddits: true,
        created_at: true,
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    res.status(200).json({
      users,
    });
  } catch (error: any) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Error fetching users', details: error.message });
  }
};