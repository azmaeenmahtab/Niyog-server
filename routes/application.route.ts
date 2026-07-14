import { Router } from 'express';
import { getApplicationsByJobIdController, getApplicationsByUserIdController, submitApplicationController, updateApplicationStatusController } from '../controllers/application.controller';
import { validateToken } from '../middlewares/verifyJWTToken';

const router = Router();

router.post('/:userId', validateToken, submitApplicationController);
router.get('/user/:userId', validateToken, getApplicationsByUserIdController);
// FEATURE 1: Get applications by Job ID
router.get("/job/:jobId", validateToken, getApplicationsByJobIdController);

// FEATURE 2: Update application status via PATCH
router.patch("/:applicationId/status", validateToken, updateApplicationStatusController);


export default router;