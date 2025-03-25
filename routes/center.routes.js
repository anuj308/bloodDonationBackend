import { Router } from 'express';
import { verifyJWT } from '../middleware/auth.middleware.js';
import {
  addCenter,
  deleteCenter
} from '../controllers/center.controller.js';

const router = Router();

// All center-related routes require authentication
router.use(verifyJWT);

// Center management routes
router.post('/add', addCenter);
router.delete('/:centerId', deleteCenter);

export default router;