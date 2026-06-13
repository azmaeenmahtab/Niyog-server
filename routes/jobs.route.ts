import { Router } from 'express';
import { getAllJobsController, getJobsByCompanyIdController } from '../controllers/jobsController';

const router = Router();

//get all jobs
router.get('/get-all-jobs', getAllJobsController);
router.get('/get-jobs-by-company-id', getJobsByCompanyIdController);

export default router;
