import { Router } from 'express';
import { executePipeline, generatePipelineSteps } from '../controllers/aiController.js';

const router = Router();

// Execute AI pipeline
router.post('/execute', executePipeline);

// Generate pipeline steps from natural language
router.post('/generate-steps', generatePipelineSteps);

export default router; 