import express from 'express';
import { UserController } from '../controllers/userController.js';

const router = express.Router();

// Create a new user
router.post('/', UserController.create);

// Create confirmed user (after email confirmation)
router.post('/confirmed', UserController.createConfirmedUser);

// Check email confirmation status
router.get('/check-email/:email', UserController.checkEmailConfirmation);

// Get user by ID
router.get('/:id', UserController.getById);

// Update user
router.put('/:id', UserController.update);

export default router; 