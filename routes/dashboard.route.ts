import { Router } from 'express';
import { getRecruiterStatsController, getAdminStatsController, getApplicantStatsController } from '../controllers/dashboard.controller';
import { validateToken } from '../middlewares/verifyJWTToken';


const router = Router();

router.get('/recruiter/:recruiterId', getRecruiterStatsController);
router.get('/admin', /* requireAdmin, */ getAdminStatsController);
router.get('/applicant/:userId', validateToken, getApplicantStatsController);

export default router;