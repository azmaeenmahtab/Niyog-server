const router = require("express").Router();
const { getAllJobsController, getJobsByCompanyIdController } = require('../controllers/jobsController');

//get all jobs
router.get('/get-all-jobs', getAllJobsController);
router.get('/get-jobs-by-company-id', getJobsByCompanyIdController);
// check this endpoint with http://localhost:5000/get-jobs-by-company-id?companyId=6913f13390cc5a68d0143753

module.exports = router;