"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteReportedJobController = exports.deactivateReportedJobController = exports.dismissReportController = exports.getAllReportsController = void 0;
const jobsService_1 = require("../services/jobsService");
const report_service_1 = require("../services/report.service");
const getAllReportsController = async (req, res) => {
    try {
        console.log("[controller] GET /admin/reports — query:", req.query);
        const status = typeof req.query.status === 'string' ? req.query.status : undefined;
        const reports = await (0, report_service_1.getAllReportsService)(status);
        return res.status(200).json({
            success: true,
            message: "Reports retrieved successfully",
            data: reports,
        });
    }
    catch (error) {
        console.log("[controller] getAllReportsController error:", error);
        return res.status(500).json({ success: false, message: "Internal server error", error: error.message });
    }
};
exports.getAllReportsController = getAllReportsController;
const dismissReportController = async (req, res) => {
    try {
        console.log("[controller] PATCH /admin/reports/:id/dismiss — params:", req.params);
        const { reportId } = req.params;
        const updated = await (0, report_service_1.updateReportStatusService)(reportId, 'dismissed');
        if (!updated) {
            return res.status(404).json({ success: false, message: "Report not found." });
        }
        return res.status(200).json({
            success: true,
            message: "Report dismissed",
            data: updated,
        });
    }
    catch (error) {
        console.log("[controller] dismissReportController error:", error);
        return res.status(500).json({ success: false, message: "Internal server error", error: error.message });
    }
};
exports.dismissReportController = dismissReportController;
const deactivateReportedJobController = async (req, res) => {
    try {
        console.log("[controller] PATCH /admin/reports/:id/deactivate-job — params:", req.params, "body:", req.body);
        const { reportId } = req.params;
        const { jobId } = req.body;
        if (!jobId) {
            return res.status(400).json({ success: false, message: "jobId is required." });
        }
        const updatedJob = await (0, jobsService_1.deactivateJobService)(jobId);
        if (!updatedJob) {
            return res.status(404).json({ success: false, message: "Job not found." });
        }
        const updatedReport = await (0, report_service_1.updateReportStatusService)(reportId, 'reviewed');
        return res.status(200).json({
            success: true,
            message: "Job deactivated and report marked reviewed",
            data: { job: updatedJob, report: updatedReport },
        });
    }
    catch (error) {
        console.log("[controller] deactivateReportedJobController error:", error);
        return res.status(500).json({ success: false, message: "Internal server error", error: error.message });
    }
};
exports.deactivateReportedJobController = deactivateReportedJobController;
const deleteReportedJobController = async (req, res) => {
    try {
        console.log("[controller] DELETE /admin/reports/:id/job — params:", req.params, "body:", req.body);
        const { reportId } = req.params;
        const { jobId } = req.body;
        if (!jobId) {
            return res.status(400).json({ success: false, message: "jobId is required." });
        }
        const deletedJob = await (0, jobsService_1.deleteJobService)(jobId);
        if (!deletedJob) {
            return res.status(404).json({ success: false, message: "Job not found." });
        }
        const updatedReport = await (0, report_service_1.updateReportStatusService)(reportId, 'reviewed');
        return res.status(200).json({
            success: true,
            message: "Job deleted and report marked reviewed",
            data: { job: deletedJob, report: updatedReport },
        });
    }
    catch (error) {
        console.log("[controller] deleteReportedJobController error:", error);
        return res.status(500).json({ success: false, message: "Internal server error", error: error.message });
    }
};
exports.deleteReportedJobController = deleteReportedJobController;
