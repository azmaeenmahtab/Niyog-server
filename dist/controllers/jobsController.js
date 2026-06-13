"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getJobsByCompanyIdController = exports.getAllJobsController = void 0;
const jobsService_1 = require("../services/jobsService");
const getAllJobsController = async (req, res) => {
    try {
        const result = await (0, jobsService_1.getAllJobsService)();
        return res.status(200).json({
            success: true,
            message: "Jobs fetched successfully",
            data: result
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};
exports.getAllJobsController = getAllJobsController;
const getJobsByCompanyIdController = async (req, res) => {
    const query = {};
    if (req.query.companyId) {
        query.companyId = req.query.companyId;
    }
    if (req.query.status) {
        query.status = req.query.status;
    }
    try {
        const result = await (0, jobsService_1.getJobsByCompanyIdService)(query);
        return res.status(200).json({
            success: true,
            message: "Jobs fetched successfully",
            data: result
        });
    }
    catch (error) {
        console.log("get jobs by id error ", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};
exports.getJobsByCompanyIdController = getJobsByCompanyIdController;
