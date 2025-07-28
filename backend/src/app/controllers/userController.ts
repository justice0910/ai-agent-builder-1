import express from 'express';
import { db } from '../../lib/db/index.js';
import * as schema from '../../lib/db/schema.ts';
import { eq } from 'drizzle-orm';

type Request = express.Request;
type Response = express.Response;

export class UserController {
  // Create a new user
  static async create(req: Request, res: Response) {
    try {
      const { id, email, name, emailConfirmed = false } = req.body;
      
      // Validate input
      if (!id) {
        return res.status(400).json({ error: 'User ID is required' });
      }
      
      if (!email) {
        return res.status(400).json({ error: 'Email is required' });
      }

      // Only create user if email is confirmed
      if (!emailConfirmed) {
        return res.status(202).json({ 
          message: 'User creation pending email confirmation',
          requiresEmailConfirmation: true
        });
      }

      // Check if user already exists by ID
      const existingUserById = await db
        .select()
        .from(schema.users)
        .where(eq(schema.users.id, id))
        .limit(1);

      if (existingUserById.length > 0) {
        // User exists, return the existing user
        return res.status(200).json(existingUserById[0]);
      }

      // Check if email already exists
      const existingUserByEmail = await db
        .select()
        .from(schema.users)
        .where(eq(schema.users.email, email))
        .limit(1);

      if (existingUserByEmail.length > 0) {
        // Email is already taken by a different user
        return res.status(409).json({ 
          error: 'Email already registered with a different account',
          details: 'This email address is already associated with another user'
        });
      }

      // Create new user only if email is confirmed
      const [user] = await db.insert(schema.users).values({
        id,
        email,
        name: name || email.split('@')[0],
        emailConfirmed: true, // Always true since we only create confirmed users
      }).returning();

      res.status(201).json(user);
    } catch (error) {
      console.error('Error creating user:', error);
      console.error('Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        name: error instanceof Error ? error.name : 'Unknown'
      });
      res.status(500).json({ 
        error: 'Failed to create user',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Create user after email confirmation
  static async createConfirmedUser(req: Request, res: Response) {
    try {
      const { id, email, name } = req.body;
      
      // Validate input
      if (!id) {
        return res.status(400).json({ error: 'User ID is required' });
      }
      
      if (!email) {
        return res.status(400).json({ error: 'Email is required' });
      }

      // Check if user already exists by ID
      const existingUserById = await db
        .select()
        .from(schema.users)
        .where(eq(schema.users.id, id))
        .limit(1);

      if (existingUserById.length > 0) {
        // User exists, return the existing user
        return res.status(200).json(existingUserById[0]);
      }

      // Check if email already exists
      const existingUserByEmail = await db
        .select()
        .from(schema.users)
        .where(eq(schema.users.email, email))
        .limit(1);

      if (existingUserByEmail.length > 0) {
        // Email is already taken by a different user
        return res.status(409).json({ 
          error: 'Email already registered with a different account',
          details: 'This email address is already associated with another user'
        });
      }

      // Create new user with confirmed email
      const [user] = await db.insert(schema.users).values({
        id,
        email,
        name: name || email.split('@')[0],
        emailConfirmed: true,
      }).returning();

      res.status(201).json(user);
    } catch (error) {
      console.error('Error creating confirmed user:', error);
      res.status(500).json({ 
        error: 'Failed to create confirmed user',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Check email confirmation status
  static async checkEmailConfirmation(req: Request, res: Response) {
    try {
      const { email } = req.params;
      
      if (!email) {
        return res.status(400).json({ error: 'Email is required' });
      }

      // Find user by email
      const user = await db
        .select()
        .from(schema.users)
        .where(eq(schema.users.email, email))
        .limit(1);

      if (user.length === 0) {
        return res.status(404).json({ 
          confirmed: false,
          error: 'User not found'
        });
      }

      const confirmed = user[0].emailConfirmed;
      
      res.status(200).json({ 
        confirmed,
        email: user[0].email,
        userId: user[0].id
      });
    } catch (error) {
      console.error('Error checking email confirmation:', error);
      res.status(500).json({ 
        error: 'Failed to check email confirmation',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Get user by ID
  static async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const [user] = await db
        .select()
        .from(schema.users)
        .where(eq(schema.users.id, id))
        .limit(1);

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json(user);
    } catch (error) {
      console.error('Error getting user:', error);
      res.status(500).json({ error: 'Failed to get user' });
    }
  }

  // Update user
  static async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { email, name, emailConfirmed } = req.body;

      const [user] = await db
        .update(schema.users)
        .set({
          email,
          name,
          emailConfirmed,
          updatedAt: new Date(),
        })
        .where(eq(schema.users.id, id))
        .returning();

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json(user);
    } catch (error) {
      console.error('Error updating user:', error);
      res.status(500).json({ error: 'Failed to update user' });
    }
  }
} 