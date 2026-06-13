"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const jobPostController_1 = require("../controllers/jobPostController");
const router = (0, express_1.Router)();
router.post('/post-job', jobPostController_1.jobPost);
exports.default = router;
