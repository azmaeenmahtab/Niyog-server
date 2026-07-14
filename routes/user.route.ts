import { Router } from "express";
import { getUserProfileController, updateUserRole } from "../controllers/user.controller";
import { validateToken } from "../middlewares/verifyJWTToken";

const router = Router();

router.patch('/update-role', validateToken, updateUserRole);
router.get('/profile/:userId', validateToken, getUserProfileController);

export default router;