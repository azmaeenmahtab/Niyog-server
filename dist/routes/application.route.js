"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const application_controller_1 = require("../controllers/application.controller");
const verifyJWTToken_1 = require("../middlewares/verifyJWTToken");
const router = (0, express_1.Router)();
router.post('/:userId', verifyJWTToken_1.validateToken, application_controller_1.submitApplicationController);
router.get('/user/:userId', verifyJWTToken_1.validateToken, application_controller_1.getApplicationsByUserIdController);
// FEATURE 1: Get applications by Job ID
router.get("/job/:jobId", verifyJWTToken_1.validateToken, application_controller_1.getApplicationsByJobIdController);
// FEATURE 2: Update application status via PATCH
router.patch("/:applicationId/status", verifyJWTToken_1.validateToken, application_controller_1.updateApplicationStatusController);
exports.default = router;
