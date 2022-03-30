import express from 'express';
import verify from '../middlewares/verifyToken.js';

import { createScooterService } from '../controllers/servicerController.js';
import { checkServicer } from '../middlewares/checkRole.js';

// Initialize the router
const router = express.Router();

router.post('/CreateAssetService', verify, checkServicer, createScooterService);

export default router;