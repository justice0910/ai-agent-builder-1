import express from 'express';
import { PipelineController } from '../controllers/pipelineController.js';

const router = express.Router();

// Pipeline routes
router.post('/', PipelineController.create);
router.get('/', PipelineController.getAllByUser);
router.get('/:id', PipelineController.getById);
router.put('/:id', PipelineController.update);
router.delete('/:id', PipelineController.delete);

export default router; 