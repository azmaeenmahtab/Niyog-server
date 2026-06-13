import { Request, Response } from 'express';
import { getAllJobsService, getJobsByCompanyIdService } from '../services/jobsService';

export const getAllJobsController = async (req: Request, res: Response): Promise<any> => {
    try {
        const result = await getAllJobsService();
        return res.status(200).json({
            success: true,
            message: "Jobs fetched successfully",
            data: result
        });
    } catch (error: any) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
}

export const getJobsByCompanyIdController = async (req: Request, res: Response): Promise<any> => {
    const query: any = {};

    if (req.query.companyId) {
        query.companyId = req.query.companyId as string;
    }

    if (req.query.status) {
        query.status = req.query.status as string;
    }

    try {
        const result = await getJobsByCompanyIdService(query);
        return res.status(200).json({
            success: true,
            message: "Jobs fetched successfully",
            data: result
        });
    } catch (error: any) {
        console.log("get jobs by id error ", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
}
