"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const jobsController_1 = require("../controllers/jobsController");
const router = (0, express_1.Router)();
//get all jobs
router.get('/get-all-jobs', jobsController_1.getAllJobsController);
router.get('/get-jobs-by-company-id', jobsController_1.getJobsByCompanyIdController);
router.get('/get-job/:id', jobsController_1.getJobByIdController);
router.post('/save-job/:userId', jobsController_1.saveJobController);
router.delete('/save-job/:userId/:jobId', jobsController_1.unsaveJobController);
router.get('/saved-jobs/:userId', jobsController_1.getSavedJobsController);
router.post('/report-job/:userId', jobsController_1.reportJobController);
router.get('/save-job/check/:userId/:jobId', jobsController_1.checkJobSavedController);
router.get('/report-job/check/:userId/:jobId', jobsController_1.checkJobReportedController);
router.patch('/update-job/:id', /* requireRecruiter, */ jobsController_1.updateJobController);
router.delete('/delete-job/:id', /* requireRecruiter, */ jobsController_1.deleteJobController);
exports.default = router;
