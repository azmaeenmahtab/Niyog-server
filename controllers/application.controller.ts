import { Request, Response } from 'express';
import { getApplicationsByJobIdService, submitApplicationService, updateApplicationStatusService } from '../services/application.service';

export const submitApplicationController = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { jobId, email } = req.body;

    if (!jobId || !email) {
      return res.status(400).json({
        success: false,
        message: 'jobId and email are required.',
      });
    }

    if(!userId || typeof userId !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID.',
      });
    }

    const result = await submitApplicationService({ userId, jobId, email });

    if (result.error === 'NOT_FOUND') {
      return res.status(404).json({ success: false, message: result.message });
    }
    if (result.error === 'CLOSED') {
      return res.status(409).json({ success: false, message: result.message });
    }
    if (result.error === 'DUPLICATE') {
      return res.status(409).json({ success: false, message: result.message });
    }

    return res.status(201).json({
      success: true,
      message: 'Application submitted successfully.',
      data: result.data,
    });
  } catch (error: any) {
    console.error('submitApplicationController error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};


import { getApplicationsByUserIdService } from '../services/application.service';

export const getApplicationsByUserIdController = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    if (!userId || typeof userId !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'userId is required.',
      });
    }

    const applications = await getApplicationsByUserIdService(userId);

    return res.status(200).json({
      success: true,
      message: 'Applications retrieved successfully',
      data: applications,
    });
  } catch (error: any) {
    console.error('getApplicationsByUserIdController error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};


export async function getApplicationsByJobIdController(req: Request, res: Response): Promise<void> {
  try {
    const { jobId } = req.params;
    if (!jobId || typeof jobId !== "string") {
      res.status(400).json({ success: false, message: "Job ID parameter is required." });
      return;
    }

    const applications = await getApplicationsByJobIdService(jobId);

    res.status(200).json({
      success: true,
      message: "Applications fetched successfully.",
      data: applications
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || "Internal server error." });
  }
}

export async function updateApplicationStatusController(req: Request, res: Response): Promise<void> {
  try {
    const { applicationId } = req.params;
    const { status } = req.body;

    if(!applicationId || typeof applicationId !== "string") {
      res.status(400).json({ success: false, message: "Application ID parameter is required." });
      return;
    }

    const updatedApplication = await updateApplicationStatusService(applicationId, status);

    if (!updatedApplication) {
      res.status(404).json({ success: false, message: "Application record not found." });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Application status updated successfully.",
      data: updatedApplication
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || "Internal server error." });
  }
}