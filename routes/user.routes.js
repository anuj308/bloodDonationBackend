import { Router } from "express";
import {
  loginUser,
  logoutUser,
  registerUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  updateAccountDetails,
} from "../controllers/user.controller.js";
import { upload } from "../middleware/multer.middleware.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/refreshToken", refreshAccessToken);

// Protected routes
router.use(verifyJWT); // Apply verifyJWT middleware to all routes below

router.post("/logout", logoutUser);
router.get("/current-user", getCurrentUser);
router.post("/change-password", changeCurrentPassword);
router.patch("/update-account", updateAccountDetails);

export default router;