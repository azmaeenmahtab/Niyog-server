import { Router } from "express";
import { updateUserRole } from "../controllers/user.controller";

const router = Router();

router.patch('/update-role', updateUserRole);


export default router;