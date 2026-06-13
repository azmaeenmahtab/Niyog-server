"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jobPost = void 0;
const jobPostService_1 = require("../services/jobPostService");
const jobPost = async (req, res) => {
    const data = req.body;
    try {
        const result = await (0, jobPostService_1.createJob)(data);
        return res.status(200).json({
            success: true,
            message: "Job posted successfully",
            data: result
        });
    }
    catch (err) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: err.message
        });
    }
};
exports.jobPost = jobPost;
