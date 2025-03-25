import { Router } from 'express';
import { upload } from '../middleware/multer.middleware.js';
import {
  registerHospital,
  verifyHospitalEmail,
  loginHospital,
  logoutHospital,
  getHospitalProfile,
  updateHospitalProfile,
  updateBloodRequirements,
  findNearbyNGOs,
  getBloodRequestHistory,
  connectWithNGO
} from '../controllers/hospital.controller.js';
import { verifyHospital } from '../middleware/auth.middleware.js';

const router = Router();

// Public routes
router.post('/register', registerHospital);
router.post('/verify-email', verifyHospitalEmail);
router.post('/login', loginHospital);

// Protected routes
router.use(verifyHospital); // All routes below will require hospital authentication

router.get('/logout', logoutHospital);
router.get('/profile', getHospitalProfile);
router.patch('/profile', updateHospitalProfile);
router.post('/blood-requirements', updateBloodRequirements);
router.get('/nearby-ngos', findNearbyNGOs);
router.get('/blood-requests', getBloodRequestHistory);
router.post('/connect-ngo', connectWithNGO);

export default router;