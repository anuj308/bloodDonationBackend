import { Router } from 'express';
import {
  createBloodRequest,
  updateBloodRequestStatus,
  transferBloodUnit,
  getNGOBloodRequests,
  getHospitalBloodRequests,
  confirmBloodDelivery
} from '../controllers/bloodRequest.controller.js';
import { verifyNGO, verifyHospital } from '../middleware/auth.middleware.js';

const router = Router();

// Routes for hospitals
router.post('/create', verifyHospital, createBloodRequest);
router.get('/hospital', verifyHospital, getHospitalBloodRequests);
router.post('/confirm-delivery/:requestId', verifyHospital, confirmBloodDelivery);

// Routes for NGOs
router.get('/ngo', verifyNGO, getNGOBloodRequests);
router.patch('/:requestId/status', verifyNGO, updateBloodRequestStatus);
router.post('/transfer/:donationId', verifyNGO, transferBloodUnit);

export default router;