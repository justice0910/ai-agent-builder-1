import type { PipelineStep, PipelineExecution } from '../../types/pipeline';

export class RealAiService {
  private apiBaseUrl: string;

  constructor() {
    this.apiBaseUrl = `http://localhost:${import.meta.env.VITE_PORT}/api`;
    console.log('🤖 Real AI Service initialized with Backend API');
  }

  async executePipeline(steps: PipelineStep[], input: string): Promise<PipelineExecution> {
    console.log('🚀 Running pipeline with backend AI service');

    try {
      const response = await fetch(`${this.apiBaseUrl}/ai/execute`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          steps,
          input
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      return result;

    } catch (error) {
      console.error('❌ Pipeline execution failed:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const realAiService = new RealAiService(); 