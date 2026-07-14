import { Router } from 'express';
import { checkJobReportedController, checkJobSavedController, getAllJobsController, getJobByIdController, getJobsByCompanyIdController, getSavedJobsController, reportJobController, saveJobController, unsaveJobController } from '../controllers/jobsController';

const router = Router();

//get all jobs
router.get('/get-all-jobs', getAllJobsController);
router.get('/get-jobs-by-company-id', getJobsByCompanyIdController);
router.get('/get-job/:id', getJobByIdController);
router.post('/save-job/:userId', saveJobController);
router.delete('/save-job/:userId/:jobId', unsaveJobController);
router.get('/saved-jobs/:userId', getSavedJobsController);
router.post('/report-job/:userId', reportJobController);
router.get('/save-job/check/:userId/:jobId', checkJobSavedController);
router.get('/report-job/check/:userId/:jobId', checkJobReportedController);

export default router;
