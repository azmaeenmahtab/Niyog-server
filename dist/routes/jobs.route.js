"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const jobsController_1 = require("../controllers/jobsController");
const router = (0, express_1.Router)();
//get all jobs
router.get('/get-all-jobs', jobsController_1.getAllJobsController);
router.get('/get-jobs-by-company-id', jobsController_1.getJobsByCompanyIdController);
exports.default = router;
