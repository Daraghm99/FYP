import express from 'express';
import { createScooterRequest, getMyScooters, transferScooter, markScooterStolen, getScooterStatus } from '../controllers/ownerController.js';
import { registerScooter, getMyRequests, approveRequest } from '../controllers/retailerController.js';

// Initialize the router
const router = express.Router();

// E-Scooter Owners
router.post('/CreateAssetRequest', createScooterRequest);
router.get('/GetMyAssets', getMyScooters);
router.put('/TransferAsset', transferScooter);
router.put('/MarkAsStolen', markScooterStolen);
router.post('/GetAssetStatus', getScooterStatus);

// Retailers
router.post('/RegisterAsset', registerScooter);
router.get('/GetMyRequests', getMyRequests);
router.put('/ApproveRequest', approveRequest);

// Servicers

// Law Enforcers

// Users

export default router;