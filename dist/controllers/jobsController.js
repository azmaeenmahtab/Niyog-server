"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteJobController = exports.updateJobController = exports.checkJobReportedController = exports.checkJobSavedController = exports.reportJobController = exports.getSavedJobsController = exports.unsaveJobController = exports.saveJobController = exports.getJobByIdController = exports.getJobsByCompanyIdController = exports.getAllJobsController = void 0;
const jobsService_1 = require("../services/jobsService");
const getAllJobsController = async (req, res) => {
    try {
        console.log("[controller] GET /get-all-jobs — raw req.query:", req.query);
        const filters = {};
        if (typeof req.query.type === "string" && req.query.type.length) {
            filters.type = req.query.type;
        }
        if (typeof req.query.location === "string" && req.query.location.length) {
            filters.location = req.query.location;
        }
        if (req.query.salary) {
            filters.salary = Number(req.query.salary);
        }
        if (typeof req.query.isRemote === "string" && req.query.isRemote.length) {
            const v = req.query.isRemote.toLowerCase();
            if (v === "true" || v === "1")
                filters.isRemote = true;
            else if (v === "false" || v === "0")
                filters.isRemote = false;
        }
        if (typeof req.query.keyword === "string" && req.query.keyword.length) {
            filters.keyword = req.query.keyword;
        }
        if (typeof req.query.place === "string" && req.query.place.length) {
            filters.place = req.query.place;
        }
        if (req.query.status === "active" || req.query.status === "inactive") {
            filters.status = req.query.status;
        }
        // Pagination params
        const parsedPage = parseInt(req.query.page, 10);
        filters.page =
            Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1;
        const parsedLimit = parseInt(req.query.limit, 10);
        const requestedLimit = Number.isFinite(parsedLimit) && parsedLimit > 0 ? parsedLimit : 10;
        filters.limit = Math.min(requestedLimit, 50); // cap to prevent abuse
        console.log("[controller] assembled filters:", filters);
        const result = await (0, jobsService_1.getAllJobsService)(filters);
        console.log("[controller] service returned", result.jobs.length, "jobs, pagination:", result.pagination);
        return res.status(200).json({
            success: true,
            message: "Jobs fetched successfully",
            data: result.jobs,
            pagination: result.pagination,
        });
    }
    catch (error) {
        console.log("[controller] error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};
exports.getAllJobsController = getAllJobsController;
const getJobsByCompanyIdController = async (req, res) => {
    console.log("[controller] GET /get-jobs-by-company-id — raw req.query:", req.query);
    const query = {};
    if (req.query.companyId) {
        query.companyId = req.query.companyId;
    }
    if (req.query.status) {
        query.status = req.query.status;
    }
    console.log("[controller] /get-jobs-by-company-id assembled query:", query);
    try {
        const result = await (0, jobsService_1.getJobsByCompanyIdService)(query);
        console.log("[controller] /get-jobs-by-company-id service returned", Array.isArray(result) ? result.length : "n/a", "jobs");
        return res.status(200).json({
            success: true,
            message: "Jobs fetched successfully",
            data: result,
        });
    }
    catch (error) {
        console.log("[controller] get jobs by id error ", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};
exports.getJobsByCompanyIdController = getJobsByCompanyIdController;
const getJobByIdController = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id || typeof id !== "string") {
            return res
                .status(400)
                .json({ success: false, message: "Invalid job ID" });
        }
        const job = await (0, jobsService_1.getJobByIdService)(id);
        if (!job) {
            return res.status(404).json({ success: false, message: "Job not found" });
        }
        return res
            .status(200)
            .json({ success: true, message: "Job fetched successfully", data: job });
    }
    catch (error) {
        console.log("[controller] getJobByIdController error:", error);
        return res
            .status(500)
            .json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};
exports.getJobByIdController = getJobByIdController;
const saveJobController = async (req, res) => {
    try {
        console.log("[controller] POST /save-job — params:", req.params, "body:", req.body);
        const { userId } = req.params;
        const { jobId } = req.body;
        if (!jobId) {
            return res
                .status(400)
                .json({ success: false, message: "jobId is required." });
        }
        if (!userId && typeof userId !== "string") {
            return res
                .status(400)
                .json({ success: false, message: "Invalid user ID" });
        }
        const result = await (0, jobsService_1.saveJobService)({ userId, jobId });
        if (result.error === "NOT_FOUND") {
            return res.status(404).json({ success: false, message: result.message });
        }
        if (result.error === "DUPLICATE") {
            return res.status(409).json({ success: false, message: result.message });
        }
        return res.status(201).json({
            success: true,
            message: "Job saved successfully",
            data: result.data,
        });
    }
    catch (error) {
        console.log("[controller] saveJobController error:", error);
        return res
            .status(500)
            .json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};
exports.saveJobController = saveJobController;
const unsaveJobController = async (req, res) => {
    try {
        console.log("[controller] DELETE /save-job — params:", req.params);
        const { userId, jobId } = req.params;
        if (!userId && typeof userId !== "string") {
            return res
                .status(400)
                .json({ success: false, message: "Invalid user ID" });
        }
        if (!jobId && typeof jobId !== "string") {
            return res
                .status(400)
                .json({ success: false, message: "Invalid job ID" });
        }
        const result = await (0, jobsService_1.unsaveJobService)(userId, jobId);
        if (!result) {
            return res
                .status(404)
                .json({ success: false, message: "Saved job not found." });
        }
        return res.status(200).json({
            success: true,
            message: "Job removed from saved list",
            data: result,
        });
    }
    catch (error) {
        console.log("[controller] unsaveJobController error:", error);
        return res
            .status(500)
            .json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};
exports.unsaveJobController = unsaveJobController;
const getSavedJobsController = async (req, res) => {
    try {
        console.log("[controller] GET /saved-jobs — params:", req.params);
        const { userId } = req.params;
        if (!userId && typeof userId !== "string") {
            return res
                .status(400)
                .json({ success: false, message: "Invalid user ID" });
        }
        const savedJobs = await (0, jobsService_1.getSavedJobsService)(userId);
        return res.status(200).json({
            success: true,
            message: "Saved jobs retrieved successfully",
            data: savedJobs,
        });
    }
    catch (error) {
        console.log("[controller] getSavedJobsController error:", error);
        return res
            .status(500)
            .json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};
exports.getSavedJobsController = getSavedJobsController;
const reportJobController = async (req, res) => {
    try {
        console.log("[controller] POST /report-job — params:", req.params, "body:", req.body);
        const { userId } = req.params;
        const { jobId, reason, details } = req.body;
        if (!jobId || !reason) {
            return res
                .status(400)
                .json({ success: false, message: "jobId and reason are required." });
        }
        const result = await (0, jobsService_1.reportJobService)({ userId, jobId, reason, details });
        if (result.error === "NOT_FOUND") {
            return res.status(404).json({ success: false, message: result.message });
        }
        if (result.error === "DUPLICATE") {
            return res.status(409).json({ success: false, message: result.message });
        }
        return res.status(201).json({
            success: true,
            message: "Job reported successfully",
            data: result.data,
        });
    }
    catch (error) {
        console.log("[controller] reportJobController error:", error);
        return res
            .status(500)
            .json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};
exports.reportJobController = reportJobController;
const checkJobSavedController = async (req, res) => {
    try {
        console.log("[controller] GET /save-job/check — params:", req.params);
        const { userId, jobId } = req.params;
        const isSaved = await (0, jobsService_1.checkJobSavedService)(userId, jobId);
        return res.status(200).json({
            success: true,
            message: "Saved status retrieved",
            data: { isSaved },
        });
    }
    catch (error) {
        console.log("[controller] checkJobSavedController error:", error);
        return res.status(500).json({ success: false, message: "Internal server error", error: error.message });
    }
};
exports.checkJobSavedController = checkJobSavedController;
const checkJobReportedController = async (req, res) => {
    try {
        console.log("[controller] GET /report-job/check — params:", req.params);
        const { userId, jobId } = req.params;
        const isReported = await (0, jobsService_1.checkJobReportedService)(userId, jobId);
        return res.status(200).json({
            success: true,
            message: "Reported status retrieved",
            data: { isReported },
        });
    }
    catch (error) {
        console.log("[controller] checkJobReportedController error:", error);
        return res.status(500).json({ success: false, message: "Internal server error", error: error.message });
    }
};
exports.checkJobReportedController = checkJobReportedController;
const updateJobController = async (req, res) => {
    try {
        console.log("[controller] PATCH /update-job/:id — params:", req.params, "body:", req.body);
        const { id } = req.params;
        const { title, category, type, deadline, salaryMin, salaryMax, currency, city, country, isRemote, responsibilities, requirements, benefits, status, } = req.body;
        const payload = {};
        if (title !== undefined)
            payload.title = title;
        if (category !== undefined)
            payload.category = category;
        if (type !== undefined)
            payload.type = type;
        if (deadline !== undefined)
            payload.deadline = deadline;
        if (salaryMin !== undefined)
            payload.salaryMin = salaryMin;
        if (salaryMax !== undefined)
            payload.salaryMax = salaryMax;
        if (currency !== undefined)
            payload.currency = currency;
        if (city !== undefined)
            payload.city = city;
        if (country !== undefined)
            payload.country = country;
        if (isRemote !== undefined)
            payload.isRemote = isRemote;
        if (responsibilities !== undefined)
            payload.responsibilities = responsibilities;
        if (requirements !== undefined)
            payload.requirements = requirements;
        if (benefits !== undefined)
            payload.benefits = benefits;
        if (status !== undefined) {
            if (!['active', 'inactive'].includes(status)) {
                return res.status(400).json({ success: false, message: "status must be 'active' or 'inactive'." });
            }
            payload.status = status;
        }
        if (Object.keys(payload).length === 0) {
            return res.status(400).json({ success: false, message: "No fields provided to update." });
        }
        const updatedJob = await (0, jobsService_1.updateJobService)(id, payload);
        if (!updatedJob) {
            return res.status(404).json({ success: false, message: "Job not found." });
        }
        return res.status(200).json({
            success: true,
            message: "Job updated successfully",
            data: updatedJob,
        });
    }
    catch (error) {
        console.log("[controller] updateJobController error:", error);
        return res.status(500).json({ success: false, message: "Internal server error", error: error.message });
    }
};
exports.updateJobController = updateJobController;
const deleteJobController = async (req, res) => {
    try {
        console.log("[controller] DELETE /delete-job/:id — params:", req.params);
        const { id } = req.params;
        const deletedJob = await (0, jobsService_1.deleteJobService)(id);
        if (!deletedJob) {
            return res.status(404).json({ success: false, message: "Job not found." });
        }
        return res.status(200).json({
            success: true,
            message: "Job deleted successfully",
            data: deletedJob,
        });
    }
    catch (error) {
        console.log("[controller] deleteJobController error:", error);
        return res.status(500).json({ success: false, message: "Internal server error", error: error.message });
    }
};
exports.deleteJobController = deleteJobController;
