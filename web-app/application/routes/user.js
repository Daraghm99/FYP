import express from 'express';
import verify from '../middlewares/verifyToken.js';
import { checkRegistrar } from '../middlewares/checkRole.js';

import { createUser, getUser, getUsers, removeParticipant } from '../controllers/userController.js';

// Initialize the router
const router = express.Router();

router.post('/Login', getUser);
router.post('/CreateUser', createUser);
router.get('/GetAllUsers', verify, checkRegistrar, getUsers);
router.put('/RemoveParticipant', verify, checkRegistrar, removeParticipant);


export default router;