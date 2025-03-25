import { Router } from 'express';
import { upload } from '../middleware/multer.middleware.js';
import {
  registerNGO,
  verifyNGOEmail,
  requestNewOTP,
  loginNGO,
  logoutNGO,
  refreshAccessToken,
  getNGOProfile,
  updateNGOProfile,
  updateBloodInventory,
  getConnectedHospitals,
  respondToConnectionRequest,
  changePassword
} from '../controllers/ngo.controller.js';
import { verifyNGO } from '../middleware/auth.middleware.js';

const router = Router();

// Public routes
router.post('/register', upload.fields([{ name: 'logo', maxCount: 1 }]), registerNGO);
router.post('/verify-email', verifyNGOEmail);
router.post('/request-otp', requestNewOTP);
router.post('/login', loginNGO);
router.post('/refresh-token', refreshAccessToken);

// Protected routes
router.use(verifyNGO); // All routes below will require NGO authentication

router.get('/logout', logoutNGO);
router.get('/profile', getNGOProfile);
router.patch('/profile', upload.fields([{ name: 'logo', maxCount: 1 }]), updateNGOProfile);
router.post('/blood-inventory', updateBloodInventory);
router.get('/connected-hospitals', getConnectedHospitals);
router.post('/connection-response', respondToConnectionRequest);
router.post('/change-password', changePassword);

export default router;