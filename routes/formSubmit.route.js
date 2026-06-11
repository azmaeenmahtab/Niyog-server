const router = require("express").Router();
const { jobPost } = require('../controllers/jobPostController')

router.post('/post-job', jobPost);

module.exports = router;
