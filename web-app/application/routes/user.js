import express from 'express';
import jwt from 'jsonwebtoken';

import { createUser, getUser } from '../controllers/userController.js';

// Initialize the router
const router = express.Router();

router.post('/CreateUser', createUser);
router.post('/Login', getUser);

export default router;