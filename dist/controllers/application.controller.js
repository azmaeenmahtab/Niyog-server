"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getApplicationsByUserIdController = exports.submitApplicationController = void 0;
exports.getApplicationsByJobIdController = getApplicationsByJobIdController;
exports.updateApplicationStatusController = updateApplicationStatusController;
const application_service_1 = require("../services/application.service");
const submitApplicationController = async (req, res) => {
    try {
        const { userId } = req.params;
        const { jobId, email } = req.body;
        if (!jobId || !email) {
            return res.status(400).json({
                success: false,
                message: 'jobId and email are required.',
            });
        }
        if (!userId || typeof userId !== 'string') {
            return res.status(400).json({
                success: false,
                message: 'Invalid user ID.',
            });
        }
        const result = await (0, application_service_1.submitApplicationService)({ userId, jobId, email });
        if (result.error === 'NOT_FOUND') {
            return res.status(404).json({ success: false, message: result.message });
        }
        if (result.error === 'CLOSED') {
            return res.status(409).json({ success: false, message: result.message });
        }
        if (result.error === 'DUPLICATE') {
            return res.status(409).json({ success: false, message: result.message });
        }
        return res.status(201).json({
            success: true,
            message: 'Application submitted successfully.',
            data: result.data,
        });
    }
    catch (error) {
        console.error('submitApplicationController error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message,
        });
    }
};
exports.submitApplicationController = submitApplicationController;
const application_service_2 = require("../services/application.service");
const getApplicationsByUserIdController = async (req, res) => {
    try {
        const { userId } = req.params;
        if (!userId || typeof userId !== 'string') {
            return res.status(400).json({
                success: false,
                message: 'userId is required.',
            });
        }
        const applications = await (0, application_service_2.getApplicationsByUserIdService)(userId);
        return res.status(200).json({
            success: true,
            message: 'Applications retrieved successfully',
            data: applications,
        });
    }
    catch (error) {
        console.error('getApplicationsByUserIdController error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message,
        });
    }
};
exports.getApplicationsByUserIdController = getApplicationsByUserIdController;
async function getApplicationsByJobIdController(req, res) {
    try {
        const { jobId } = req.params;
        if (!jobId || typeof jobId !== "string") {
            res.status(400).json({ success: false, message: "Job ID parameter is required." });
            return;
        }
        const applications = await (0, application_service_1.getApplicationsByJobIdService)(jobId);
        res.status(200).json({
            success: true,
            message: "Applications fetched successfully.",
            data: applications
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message || "Internal server error." });
    }
}
async function updateApplicationStatusController(req, res) {
    try {
        const { applicationId } = req.params;
        const { status } = req.body;
        if (!applicationId || typeof applicationId !== "string") {
            res.status(400).json({ success: false, message: "Application ID parameter is required." });
            return;
        }
        const updatedApplication = await (0, application_service_1.updateApplicationStatusService)(applicationId, status);
        if (!updatedApplication) {
            res.status(404).json({ success: false, message: "Application record not found." });
            return;
        }
        res.status(200).json({
            success: true,
            message: "Application status updated successfully.",
            data: updatedApplication
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message || "Internal server error." });
    }
}
