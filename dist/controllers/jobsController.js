"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getJobsByCompanyIdController = exports.getAllJobsController = void 0;
const jobsService_1 = require("../services/jobsService");
const getAllJobsController = async (req, res) => {
    try {
        console.log("[controller] GET /get-all-jobs — raw req.query:", req.query);
        // extract all the query data from the queryparams
        const filters = {};
        if (typeof req.query.type === 'string' && req.query.type.length) {
            filters.type = req.query.type;
        }
        if (typeof req.query.location === 'string' && req.query.location.length) {
            filters.location = req.query.location;
        }
        if (req.query.salary) {
            filters.salary = Number(req.query.salary);
        }
        if (typeof req.query.isRemote === 'string' && req.query.isRemote.length) {
            const v = req.query.isRemote.toLowerCase();
            if (v === 'true' || v === '1')
                filters.isRemote = true;
            else if (v === 'false' || v === '0')
                filters.isRemote = false;
        }
        if (typeof req.query.keyword === 'string' && req.query.keyword.length) {
            filters.keyword = req.query.keyword;
        }
        if (typeof req.query.place === 'string' && req.query.place.length) {
            filters.place = req.query.place;
        }
        console.log("[controller] assembled filters:", filters);
        const result = await (0, jobsService_1.getAllJobsService)(filters);
        console.log("[controller] service returned", Array.isArray(result) ? result.length : "n/a", "jobs");
        return res.status(200).json({
            success: true,
            message: "Jobs fetched successfully",
            data: result
        });
    }
    catch (error) {
        console.log("[controller] error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
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
            data: result
        });
    }
    catch (error) {
        console.log("[controller] get jobs by id error ", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};
exports.getJobsByCompanyIdController = getJobsByCompanyIdController;
