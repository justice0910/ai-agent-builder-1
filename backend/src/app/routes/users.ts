import express from 'express';
import { UserController } from '../controllers/userController.js';

const router = express.Router();

// Create a new user
router.post('/', UserController.create);

// Get user by ID
router.get('/:id', UserController.getById);

// Update user
router.put('/:id', UserController.update);

export default router; 