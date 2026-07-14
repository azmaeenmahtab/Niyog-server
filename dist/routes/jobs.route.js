"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const jobsController_1 = require("../controllers/jobsController");
const verifyJWTToken_1 = require("../middlewares/verifyJWTToken");
const router = (0, express_1.Router)();
//get all jobs
router.get('/get-all-jobs', jobsController_1.getAllJobsController);
router.get('/get-jobs-by-company-id', verifyJWTToken_1.validateToken, jobsController_1.getJobsByCompanyIdController);
router.get('/get-job/:id', verifyJWTToken_1.validateToken, jobsController_1.getJobByIdController);
router.post('/save-job/:userId', verifyJWTToken_1.validateToken, jobsController_1.saveJobController);
router.delete('/save-job/:userId/:jobId', verifyJWTToken_1.validateToken, jobsController_1.unsaveJobController);
router.get('/saved-jobs/:userId', verifyJWTToken_1.validateToken, jobsController_1.getSavedJobsController);
router.post('/report-job/:userId', verifyJWTToken_1.validateToken, jobsController_1.reportJobController);
router.get('/save-job/check/:userId/:jobId', verifyJWTToken_1.validateToken, jobsController_1.checkJobSavedController);
router.get('/report-job/check/:userId/:jobId', verifyJWTToken_1.validateToken, jobsController_1.checkJobReportedController);
router.patch('/update-job/:id', verifyJWTToken_1.validateToken, /* requireRecruiter, */ jobsController_1.updateJobController);
router.delete('/delete-job/:id', verifyJWTToken_1.validateToken, /* requireRecruiter, */ jobsController_1.deleteJobController);
exports.default = router;
