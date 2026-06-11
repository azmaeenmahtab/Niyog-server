const { createJob } = require('../services/jobPostService');

const jobPost = async (req, res) => {
    const data = req.body;

    try {
        const result = await createJob(data);

        return res.status(200).json({
            success: true,
            message: "Job posted successfully",
            data: result
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: err.message
        });
    }
}

module.exports = { jobPost };