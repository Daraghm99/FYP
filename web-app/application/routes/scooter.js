import express from 'express';
import verify from '../middlewares/verifyToken.js';

import { createScooterRequest, getMyScooters, transferScooter, markScooterStolen, getScooterStatus, getScooterServiceHistory, getScooterHistory } from '../controllers/ownerController.js';
import { registerScooter, getMyRequests, approveRequest, rejectRequest } from '../controllers/retailerController.js';
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
router.post('/GetAssetServiceHistory', verify, checkOwner, getScooterServiceHistory);
router.post('/GetScooterHistory', verify, checkOwner, getScooterHistory);

// Retailers
router.post('/RegisterAsset', verify, checkRetailer, registerScooter);
router.get('/GetMyRequests', verify, checkRetailer, getMyRequests);
router.put('/ApproveRequest', verify, checkRetailer, approveRequest);
router.put('/RejectRequest', verify, checkRetailer, rejectRequest);

// Law Enforcers
router.post('/ReviewScooter', verify, checkLaw, reviewScooter);
router.get('/GetStolenAssets', verify, checkLaw, getStolenScooters);

export default router;