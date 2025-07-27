import express from 'express';
import { db } from '../../lib/db/index.js';
import * as schema from '../../lib/db/schema.ts';
import { eq, and } from 'drizzle-orm';

type Request = express.Request;
type Response = express.Response;

export class PipelineController {
  // Create a new pipeline
  static async create(req: Request, res: Response) {
    try {
      const { name, description, userId, steps } = req.body;
      
      // Validate input
      if (!name?.trim()) {
        return res.status(400).json({ error: 'Pipeline name is required' });
      }
      
      if (!userId) {
        return res.status(400).json({ error: 'User ID is required' });
      }
      
      if (!steps || steps.length === 0) {
        return res.status(400).json({ error: 'At least one step is required' });
      }

      // Check if user exists, create if not
      let user = await db.select().from(schema.users).where(eq(schema.users.id, userId)).limit(1);
      
      if (user.length === 0) {
        // Create user with basic info from Supabase ID
        const [newUser] = await db.insert(schema.users).values({
          id: userId,
          email: `${userId}@temp.com`, // Temporary email
          name: `User ${userId.slice(0, 8)}`, // Temporary name
          emailConfirmed: true, // Assume confirmed for now
        }).returning();
        user = [newUser];
        console.log('✅ Created user automatically:', newUser.id);
      }

      // Create pipeline
      const [pipeline] = await db.insert(schema.pipelines).values({
        name: name.trim(),
        description: description?.trim(),
        userId: userId,
      }).returning();

      // Create steps
      const stepsData = steps.map((step: any, index: number) => ({
        pipelineId: pipeline.id,
        type: step.type,
        config: step.config,
        order: step.order || index + 1,
      }));

      const createdSteps = await db.insert(schema.pipelineSteps).values(stepsData).returning();

      res.json({
        ...pipeline,
        steps: createdSteps,
      });
    } catch (error) {
      console.error('Error creating pipeline:', error);
      console.error('Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        name: error instanceof Error ? error.name : 'Unknown'
      });
      
      // Provide more specific error messages
      let errorMessage = 'Failed to create pipeline';
      if (error instanceof Error) {
        if (error.message.includes('foreign key constraint')) {
          errorMessage = 'User not found. Please sign in again.';
        } else if (error.message.includes('duplicate key')) {
          errorMessage = 'Pipeline with this name already exists.';
        } else {
          errorMessage = error.message;
        }
      }
      
      res.status(500).json({ 
        error: errorMessage,
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Get all pipelines for a user
  static async getAllByUser(req: Request, res: Response) {
    try {
      const { userId } = req.query;
      
      if (!userId) {
        return res.status(400).json({ error: 'User ID is required' });
      }

      const pipelines = await db
        .select()
        .from(schema.pipelines)
        .where(eq(schema.pipelines.userId, userId as string))
        .orderBy(schema.pipelines.createdAt);

      // Get steps for each pipeline
      const pipelinesWithSteps = await Promise.all(
        pipelines.map(async (pipeline) => {
          const steps = await db
            .select()
            .from(schema.pipelineSteps)
            .where(eq(schema.pipelineSteps.pipelineId, pipeline.id))
            .orderBy(schema.pipelineSteps.order);

          return {
            ...pipeline,
            steps,
          };
        })
      );

      res.json(pipelinesWithSteps);
    } catch (error) {
      console.error('Error getting pipelines:', error);
      res.status(500).json({ error: 'Failed to get pipelines' });
    }
  }

  // Get a specific pipeline
  static async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { userId } = req.query;

      // Get pipeline
      const [pipeline] = await db
        .select()
        .from(schema.pipelines)
        .where(userId 
          ? and(eq(schema.pipelines.id, id), eq(schema.pipelines.userId, userId as string))
          : eq(schema.pipelines.id, id)
        );

      if (!pipeline) {
        return res.status(404).json({ error: 'Pipeline not found' });
      }

      // Get steps for the pipeline
      const steps = await db
        .select()
        .from(schema.pipelineSteps)
        .where(eq(schema.pipelineSteps.pipelineId, pipeline.id))
        .orderBy(schema.pipelineSteps.order);

      res.json({
        ...pipeline,
        steps,
      });
    } catch (error) {
      console.error('Error getting pipeline:', error);
      res.status(500).json({ error: 'Failed to get pipeline' });
    }
  }

  // Update a pipeline
  static async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { name, description, steps } = req.body;
      const { userId } = req.query;

      // Validate input
      if (!name?.trim()) {
        return res.status(400).json({ error: 'Pipeline name is required' });
      }

      // Check if pipeline exists and belongs to user
      const [existingPipeline] = await db
        .select()
        .from(schema.pipelines)
        .where(and(eq(schema.pipelines.id, id), eq(schema.pipelines.userId, userId as string)));

      if (!existingPipeline) {
        return res.status(404).json({ error: 'Pipeline not found' });
      }

      // Update pipeline
      const [updatedPipeline] = await db
        .update(schema.pipelines)
        .set({
          name: name.trim(),
          description: description?.trim(),
          updatedAt: new Date(),
        })
        .where(eq(schema.pipelines.id, id))
        .returning();

      // Update steps if provided
      if (steps && steps.length > 0) {
        // Delete existing steps
        await db
          .delete(schema.pipelineSteps)
          .where(eq(schema.pipelineSteps.pipelineId, id));

        // Create new steps
        const stepsData = steps.map((step: any, index: number) => ({
          pipelineId: id,
          type: step.type,
          config: step.config,
          order: step.order || index + 1,
        }));

        await db.insert(schema.pipelineSteps).values(stepsData);
      }

      // Get updated steps
      const updatedSteps = await db
        .select()
        .from(schema.pipelineSteps)
        .where(eq(schema.pipelineSteps.pipelineId, id))
        .orderBy(schema.pipelineSteps.order);

      res.json({
        ...updatedPipeline,
        steps: updatedSteps,
      });
    } catch (error) {
      console.error('Error updating pipeline:', error);
      res.status(500).json({ error: 'Failed to update pipeline' });
    }
  }

  // Delete a pipeline
  static async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { userId } = req.query;

      // Check if pipeline exists and belongs to user
      const [pipeline] = await db
        .select()
        .from(schema.pipelines)
        .where(and(eq(schema.pipelines.id, id), eq(schema.pipelines.userId, userId as string)));

      if (!pipeline) {
        return res.status(404).json({ error: 'Pipeline not found' });
      }

      // Delete pipeline (steps will be deleted due to cascade)
      await db
        .delete(schema.pipelines)
        .where(eq(schema.pipelines.id, id));

      res.json({ message: 'Pipeline deleted successfully' });
    } catch (error) {
      console.error('Error deleting pipeline:', error);
      res.status(500).json({ error: 'Failed to delete pipeline' });
    }
  }
} 