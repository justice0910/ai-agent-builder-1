import express from 'express';
import { UserController } from '../controllers/userController.js';

const router = express.Router();

router.post('/', UserController.create);

router.post('/confirmed', UserController.createConfirmedUser);

router.get('/check-email/:email', UserController.checkEmailConfirmation);

router.get('/:id', UserController.getById);

router.put('/:id', UserController.update);

export default router; 