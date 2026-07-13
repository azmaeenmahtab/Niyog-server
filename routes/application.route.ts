import { Router } from 'express';
import { getApplicationsByJobIdController, getApplicationsByUserIdController, submitApplicationController, updateApplicationStatusController } from '../controllers/application.controller';
// import { requireApplicant } from '../middlewares/auth.middleware';

const router = Router();

router.post('/:userId', /* requireApplicant, */ submitApplicationController);
router.get('/user/:userId', /* requireApplicant, */ getApplicationsByUserIdController);
// FEATURE 1: Get applications by Job ID
router.get("/job/:jobId", getApplicationsByJobIdController);

// FEATURE 2: Update application status via PATCH
router.patch("/:applicationId/status", updateApplicationStatusController);


export default router;