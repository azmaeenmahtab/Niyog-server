"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const jobPostController_1 = require("../controllers/jobPostController");
const verifyJWTToken_1 = require("../middlewares/verifyJWTToken");
const router = (0, express_1.Router)();
router.post('/post-job', verifyJWTToken_1.validateToken, jobPostController_1.jobPost);
exports.default = router;
