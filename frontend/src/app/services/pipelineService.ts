import type { PipelineExecution } from '../../types/pipeline';

// Define the types locally since they're not in the frontend types
interface PipelineWithSteps {
  id: string;
  name: string;
  description?: string;
  userId: string;
  steps: Array<{
    id: string;
    type: string;
    config: any;
    order: number;
    createdAt: string;
    updatedAt: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

interface CreatePipelineData {
  name: string;
  description?: string;
  userId: string;
  steps: Array<{
    type: string;
    config: any;
    order: number;
  }>;
}

interface UpdatePipelineData {
  name?: string;
  description?: string;
  steps?: Array<{
    type: string;
    config: any;
    order: number;
  }>;
}

interface PipelineExecutionWithOutputs extends PipelineExecution {
  outputs: Array<{
    stepId: string;
    output: string;
    processingTime: number;
  }>;
}



const API_BASE_URL = `http://localhost:${import.meta.env.VITE_PORT || 3001}/api`;

export class PipelineService {
  /**
   * Create a new pipeline with steps
   */
  async createPipeline(data: CreatePipelineData): Promise<PipelineWithSteps> {
    try {
      // Validate input
      if (!data.name.trim()) {
        throw new Error('Pipeline name is required');
      }
      
      if (!data.userId) {
        throw new Error('User ID is required');
      }
      
      if (!data.steps || data.steps.length === 0) {
        throw new Error('At least one step is required');
      }

      const response = await fetch(`${API_BASE_URL}/pipelines`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create pipeline');
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating pipeline:', error);
      throw new Error(`Failed to create pipeline: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get pipeline by ID with all steps
   */
  async getPipelineById(id: string, userId?: string): Promise<PipelineWithSteps | null> {
    try {
      const url = new URL(`${API_BASE_URL}/pipelines/${id}`);
      if (userId) {
        url.searchParams.append('userId', userId);
      }

      const response = await fetch(url.toString());

      if (response.status === 404) {
        return null;
      }

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to get pipeline');
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting pipeline:', error);
      throw new Error(`Failed to get pipeline: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get all pipelines for a user
   */
  async getPipelinesByUserId(userId: string): Promise<PipelineWithSteps[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/pipelines?userId=${userId}`);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to get user pipelines');
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting user pipelines:', error);
      throw new Error(`Failed to get user pipelines: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Update an existing pipeline
   */
  async updatePipeline(id: string, userId: string, data: UpdatePipelineData): Promise<PipelineWithSteps | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/pipelines/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          ...data,
        }),
      });

      if (response.status === 404) {
        return null;
      }

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update pipeline');
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating pipeline:', error);
      throw new Error(`Failed to update pipeline: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Delete a pipeline and all its related data
   */
  async deletePipeline(id: string, userId: string): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/pipelines/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });

      if (response.status === 404) {
        return false;
      }

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete pipeline');
      }

      return true;
    } catch (error) {
      console.error('Error deleting pipeline:', error);
      throw new Error(`Failed to delete pipeline: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Create a pipeline execution
   */
  async createPipelineExecution(data: {
    pipelineId: string;
    userId: string;
    input: string;
  }): Promise<PipelineExecutionWithOutputs> {
    try {
      const response = await fetch(`${API_BASE_URL}/pipelines/execute`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to execute pipeline');
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating pipeline execution:', error);
      throw new Error(`Failed to create pipeline execution: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Update pipeline execution status
   */
  async updatePipelineExecution(id: string, data: {
    status?: 'pending' | 'running' | 'completed' | 'failed';
    totalProcessingTime?: number;
  }): Promise<Record<string, unknown> | null> {
    try {
      // For now, return a mock updated execution
      // In a real app, you'd have an execution update endpoint
      return {
        id,
        ...data,
        updatedAt: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Error updating pipeline execution:', error);
      throw new Error(`Failed to update pipeline execution: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Add output for a pipeline execution step
   */
  async addPipelineExecutionOutput(data: {
    executionId: string;
    stepId: string;
    output: string;
    processingTime: number;
  }): Promise<void> {
    try {
      // For now, just log the output
      // In a real app, you'd have an output endpoint
      console.log('Pipeline execution output:', data);
    } catch (error) {
      console.error('Error adding pipeline execution output:', error);
      throw new Error(`Failed to add pipeline execution output: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get pipeline execution with outputs
   */
  async getPipelineExecutionWithOutputs(id: string): Promise<PipelineExecutionWithOutputs | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/pipelines/executions/${id}`);

      if (response.status === 404) {
      return null;
      }

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to get pipeline execution');
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting pipeline execution:', error);
      throw new Error(`Failed to get pipeline execution: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get all executions for a user
   */
  async getPipelineExecutionsByUserId(userId: string): Promise<Record<string, unknown>[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/pipelines/executions?userId=${userId}`);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to get user pipeline executions');
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting user pipeline executions:', error);
      throw new Error(`Failed to get user pipeline executions: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get user statistics
   */
  async getUserStats(userId: string): Promise<{
    totalPipelines: number;
    totalExecutions: number;
    completedExecutions: number;
    failedExecutions: number;
    averageProcessingTime: number;
  }> {
    try {
      const pipelines = await this.getPipelinesByUserId(userId);
      
      return {
        totalPipelines: pipelines.length,
        totalExecutions: 0, // Will be implemented when execution endpoints are added
        completedExecutions: 0,
        failedExecutions: 0,
        averageProcessingTime: 0,
      };
    } catch (error) {
      console.error('Error getting user stats:', error);
      throw new Error(`Failed to get user stats: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Search pipelines by name
   */
  async searchPipelines(userId: string, searchTerm: string): Promise<PipelineWithSteps[]> {
    try {
      const allPipelines = await this.getPipelinesByUserId(userId);
      
      return allPipelines.filter(pipeline => 
        pipeline.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    } catch (error) {
      console.error('Error searching pipelines:', error);
      throw new Error(`Failed to search pipelines: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

export const pipelineService = new PipelineService(); 