import { Request, Response } from 'express';
import { createJob } from '../services/jobPostService';

export const jobPost = async (req: Request, res: Response): Promise<any> => {
    const data = req.body;

    try {
        const result = await createJob(data);

        return res.status(200).json({
            success: true,
            message: "Job posted successfully",
            data: result
        });
    } catch (err: any) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: err.message
        });
    }
}
