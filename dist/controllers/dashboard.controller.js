"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getApplicantStatsController = exports.getAdminStatsController = exports.getRecruiterStatsController = void 0;
const dashboar_service_1 = require("../services/dashboar.service");
const getRecruiterStatsController = async (req, res) => {
    try {
        const { recruiterId } = req.params;
        const stats = await (0, dashboar_service_1.getRecruiterStatsService)(recruiterId);
        return res.status(200).json({ success: true, message: "Recruiter stats retrieved", data: stats });
    }
    catch (error) {
        console.log("[controller] getRecruiterStatsController error:", error);
        return res.status(500).json({ success: false, message: "Internal server error", error: error.message });
    }
};
exports.getRecruiterStatsController = getRecruiterStatsController;
const getAdminStatsController = async (req, res) => {
    try {
        const stats = await (0, dashboar_service_1.getAdminStatsService)();
        return res.status(200).json({ success: true, message: "Admin stats retrieved", data: stats });
    }
    catch (error) {
        console.log("[controller] getAdminStatsController error:", error);
        return res.status(500).json({ success: false, message: "Internal server error", error: error.message });
    }
};
exports.getAdminStatsController = getAdminStatsController;
const getApplicantStatsController = async (req, res) => {
    try {
        const { userId } = req.params;
        const stats = await (0, dashboar_service_1.getApplicantStatsService)(userId);
        return res.status(200).json({ success: true, message: "Applicant stats retrieved", data: stats });
    }
    catch (error) {
        console.log("[controller] getApplicantStatsController error:", error);
        return res.status(500).json({ success: false, message: "Internal server error", error: error.message });
    }
};
exports.getApplicantStatsController = getApplicantStatsController;
