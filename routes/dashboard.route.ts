import { Router } from 'express';
import { getRecruiterStatsController, getAdminStatsController, getApplicantStatsController } from '../controllers/dashboard.controller';

const router = Router();

router.get('/recruiter/:recruiterId', getRecruiterStatsController);
router.get('/admin', /* requireAdmin, */ getAdminStatsController);
router.get('/applicant/:userId', getApplicantStatsController);

export default router;