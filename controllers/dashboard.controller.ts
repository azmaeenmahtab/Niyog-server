import { Request, Response } from 'express';
import { getRecruiterStatsService, getAdminStatsService, getApplicantStatsService } from '../services/dashboar.service';

export const getRecruiterStatsController = async (req: Request, res: Response): Promise<any> => {
    try {
        const { recruiterId } = req.params;
        const stats = await getRecruiterStatsService(recruiterId as string);
        return res.status(200).json({ success: true, message: "Recruiter stats retrieved", data: stats });
    } catch (error: any) {
        console.log("[controller] getRecruiterStatsController error:", error);
        return res.status(500).json({ success: false, message: "Internal server error", error: error.message });
    }
}

export const getAdminStatsController = async (req: Request, res: Response): Promise<any> => {
    try {
        const stats = await getAdminStatsService();
        return res.status(200).json({ success: true, message: "Admin stats retrieved", data: stats });
    } catch (error: any) {
        console.log("[controller] getAdminStatsController error:", error);
        return res.status(500).json({ success: false, message: "Internal server error", error: error.message });
    }
}

export const getApplicantStatsController = async (req: Request, res: Response): Promise<any> => {
    try {
        const { userId } = req.params;
        const stats = await getApplicantStatsService(userId as string);
        return res.status(200).json({ success: true, message: "Applicant stats retrieved", data: stats });
    } catch (error: any) {
        console.log("[controller] getApplicantStatsController error:", error);
        return res.status(500).json({ success: false, message: "Internal server error", error: error.message });
    }
}