import { Request, Response } from 'express';
import { AiService } from '../../services/aiService.js';

const aiService = new AiService();

export const executePipeline = async (req: Request, res: Response) => {
  try {
    const { steps, input } = req.body;

    // Validate request
    if (!steps || !Array.isArray(steps)) {
      return res.status(400).json({ 
        error: 'Invalid request: steps array is required' 
      });
    }

    if (!input || typeof input !== 'string') {
      return res.status(400).json({ 
        error: 'Invalid request: input text is required' 
      });
    }

    // Validate each step
    for (const step of steps) {
      if (!step.id || !step.type || !step.config) {
        return res.status(400).json({ 
          error: 'Invalid step format: each step must have id, type, and config' 
        });
      }
    }

    console.log('🤖 Executing AI pipeline with steps:', steps.length);
    console.log('📝 Input text length:', input.length);

    const result = await aiService.executePipeline(steps, input);

    console.log('✅ Pipeline execution completed');
    console.log('⏱️ Total processing time:', result.totalProcessingTime, 'ms');

    res.json(result);

  } catch (error) {
    console.error('❌ Pipeline execution failed:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    res.status(500).json({ 
      error: 'Pipeline execution failed',
      message: errorMessage,
      status: 'failed'
    });
  }
};

export const generatePipelineSteps = async (req: Request, res: Response) => {
  try {
    const { instruction } = req.body;

    if (!instruction || typeof instruction !== 'string') {
      return res.status(400).json({ 
        error: 'Invalid request: instruction text is required' 
      });
    }

    console.log('🤖 Generating pipeline steps from instruction:', instruction);

    const steps = await aiService.generatePipelineSteps(instruction);

    console.log('✅ Pipeline steps generated:', steps.length);

    res.json({ steps });

  } catch (error) {
    console.error('❌ Pipeline step generation failed:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    res.status(500).json({ 
      error: 'Pipeline step generation failed',
      message: errorMessage,
      status: 'failed'
    });
  }
}; 