import express from 'express';
import verify from '../middlewares/verifyToken.js';

import { createScooterRequest, getMyScooters, transferScooter, markScooterStolen, getScooterStatus } from '../controllers/ownerController.js';
import { registerScooter, getMyRequests, approveRequest } from '../controllers/retailerController.js';
import { reviewScooter, getStolenScooters } from '../controllers/lawController.js';
import { checkOwner, checkRetailer, checkLaw } from '../middlewares/checkRole.js';

// Initialize the router
const router = express.Router();

// E-Scooter Owners
router.post('/CreateAssetRequest', verify, checkOwner, createScooterRequest);
router.get('/GetMyAssets', verify, checkOwner, getMyScooters);
router.put('/TransferAsset', verify, checkOwner, transferScooter);
router.put('/MarkAsStolen', verify, checkOwner, markScooterStolen);
router.post('/GetAssetStatus', verify, checkOwner, getScooterStatus);

// Retailers
router.post('/RegisterAsset', verify, checkRetailer, registerScooter);
router.get('/GetMyRequests', verify, checkRetailer, getMyRequests);
router.put('/ApproveRequest', verify, checkRetailer, approveRequest);

// Law Enforcers
router.get('/ReviewScooter', verify, checkLaw, reviewScooter);
router.get('/GetStolenAssets', verify, checkLaw, getStolenScooters);

export default router;