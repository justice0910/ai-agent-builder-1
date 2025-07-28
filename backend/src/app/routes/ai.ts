import { Router } from 'express';
import { executePipeline } from '../controllers/aiController.js';

const router = Router();

// Execute AI pipeline
router.post('/execute', executePipeline);

export default router; 