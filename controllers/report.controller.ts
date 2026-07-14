import { deactivateJobService, deleteJobService } from "../services/jobsService";
import { getAllReportsService, updateReportStatusService } from "../services/report.service";
import { Request, Response } from "express";

export const getAllReportsController = async (req: Request, res: Response): Promise<any> => {
    try {
        console.log("[controller] GET /admin/reports — query:", req.query);
        const status = typeof req.query.status === 'string' ? req.query.status : undefined;

        const reports = await getAllReportsService(status);

        return res.status(200).json({
            success: true,
            message: "Reports retrieved successfully",
            data: reports,
        });
    } catch (error: any) {
        console.log("[controller] getAllReportsController error:", error);
        return res.status(500).json({ success: false, message: "Internal server error", error: error.message });
    }
}

export const dismissReportController = async (req: Request, res: Response): Promise<any> => {
    try {
        console.log("[controller] PATCH /admin/reports/:id/dismiss — params:", req.params);
        const { reportId } = req.params;

        const updated = await updateReportStatusService(reportId as string, 'dismissed');

        if (!updated) {
            return res.status(404).json({ success: false, message: "Report not found." });
        }

        return res.status(200).json({
            success: true,
            message: "Report dismissed",
            data: updated,
        });
    } catch (error: any) {
        console.log("[controller] dismissReportController error:", error);
        return res.status(500).json({ success: false, message: "Internal server error", error: error.message });
    }
}

export const deactivateReportedJobController = async (req: Request, res: Response): Promise<any> => {
    try {
        console.log("[controller] PATCH /admin/reports/:id/deactivate-job — params:", req.params, "body:", req.body);
        const { reportId } = req.params;
        const { jobId } = req.body;

        if (!jobId) {
            return res.status(400).json({ success: false, message: "jobId is required." });
        }

        const updatedJob = await deactivateJobService(jobId);
        if (!updatedJob) {
            return res.status(404).json({ success: false, message: "Job not found." });
        }

        const updatedReport = await updateReportStatusService(reportId as string, 'reviewed');

        return res.status(200).json({
            success: true,
            message: "Job deactivated and report marked reviewed",
            data: { job: updatedJob, report: updatedReport },
        });
    } catch (error: any) {
        console.log("[controller] deactivateReportedJobController error:", error);
        return res.status(500).json({ success: false, message: "Internal server error", error: error.message });
    }
}

export const deleteReportedJobController = async (req: Request, res: Response): Promise<any> => {
    try {
        console.log("[controller] DELETE /admin/reports/:id/job — params:", req.params, "body:", req.body);
        const { reportId } = req.params;
        const { jobId } = req.body;

        if (!jobId) {
            return res.status(400).json({ success: false, message: "jobId is required." });
        }

        const deletedJob = await deleteJobService(jobId);
        if (!deletedJob) {
            return res.status(404).json({ success: false, message: "Job not found." });
        }

        const updatedReport = await updateReportStatusService(reportId as string, 'reviewed');

        return res.status(200).json({
            success: true,
            message: "Job deleted and report marked reviewed",
            data: { job: deletedJob, report: updatedReport },
        });
    } catch (error: any) {
        console.log("[controller] deleteReportedJobController error:", error);
        return res.status(500).json({ success: false, message: "Internal server error", error: error.message });
    }
}