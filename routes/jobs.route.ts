import { Router } from 'express';
import { checkJobReportedController, checkJobSavedController, deleteJobController, getAllJobsController, getJobByIdController, getJobsByCompanyIdController, getSavedJobsController, reportJobController, saveJobController, unsaveJobController, updateJobController } from '../controllers/jobsController';
import { validateToken } from '../middlewares/verifyJWTToken';

const router = Router();

//get all jobs
router.get('/get-all-jobs', getAllJobsController);
router.get('/get-jobs-by-company-id', validateToken, getJobsByCompanyIdController);
router.get('/get-job/:id', validateToken, getJobByIdController);
router.post('/save-job/:userId', validateToken, saveJobController);
router.delete('/save-job/:userId/:jobId', validateToken, unsaveJobController);
router.get('/saved-jobs/:userId', validateToken, getSavedJobsController);
router.post('/report-job/:userId', validateToken, reportJobController);
router.get('/save-job/check/:userId/:jobId', validateToken, checkJobSavedController);
router.get('/report-job/check/:userId/:jobId', validateToken, checkJobReportedController);
router.patch('/update-job/:id', validateToken, /* requireRecruiter, */ updateJobController);
router.delete('/delete-job/:id', validateToken, /* requireRecruiter, */ deleteJobController);

export default router;
