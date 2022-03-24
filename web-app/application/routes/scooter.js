import express from 'express';
import verify from '../utils/verifyToken.js';

import { createScooterRequest, getMyScooters, transferScooter, markScooterStolen, getScooterStatus } from '../controllers/ownerController.js';
import { registerScooter, getMyRequests, approveRequest } from '../controllers/retailerController.js';

// Initialize the router
const router = express.Router();

// E-Scooter Owners
router.post('/CreateAssetRequest', verify, createScooterRequest);
router.get('/GetMyAssets', verify, getMyScooters);
router.put('/TransferAsset', verify, transferScooter);
router.put('/MarkAsStolen', verify, markScooterStolen);
router.post('/GetAssetStatus', verify, getScooterStatus);

// Retailers
router.post('/RegisterAsset', registerScooter);
router.get('/GetMyRequests', getMyRequests);
router.put('/ApproveRequest', approveRequest);

// Servicers

// Law Enforcers

export default router;