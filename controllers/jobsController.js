const { getAllJobsService, getJobsByCompanyIdService } = require('../services/jobsService');

const getAllJobsController = async (req, res) => {
    try {
        const result = await getAllJobsService();
        return res.status(200).json({
            success: true,
            message: "Jobs fetched successfully",
            data: result
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
}


const getJobsByCompanyIdController = async (req, res) => {

    const query = {};

    if (req.query.companyId) {
        query.companyId = req.query.companyId;
    }

    if (req.query.status) {
        query.status = req.query.status;
    }

    try {

        const result = await getJobsByCompanyIdService(query);
        return res.status(200).json({
            success: true,
            message: "Jobs fetched successfully",
            data: result
        });

    } catch (error) {
        console.log("get jobs by id error ", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }

}

module.exports = { getAllJobsController, getJobsByCompanyIdController }