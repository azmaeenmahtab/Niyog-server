import { Request, Response } from "express";
import {
  checkJobReportedService,
  checkJobSavedService,
  getAllJobsService,
  getJobByIdService,
  getJobsByCompanyIdService,
  getSavedJobsService,
  reportJobService,
  saveJobService,
  unsaveJobService,
} from "../services/jobsService";

export const getAllJobsController = async (
  req: Request,
  res: Response,
): Promise<any> => {
  try {
    console.log("[controller] GET /get-all-jobs — raw req.query:", req.query);
    const filters: {
      type?: string;
      location?: string;
      salary?: number;
      keyword?: string;
      place?: string;
      isRemote?: boolean;
      page?: number;
      limit?: number;
    } = {};

    if (typeof req.query.type === "string" && req.query.type.length) {
      filters.type = req.query.type;
    }
    if (typeof req.query.location === "string" && req.query.location.length) {
      filters.location = req.query.location;
    }
    if (req.query.salary) {
      filters.salary = Number(req.query.salary);
    }
    if (typeof req.query.isRemote === "string" && req.query.isRemote.length) {
      const v = req.query.isRemote.toLowerCase();
      if (v === "true" || v === "1") filters.isRemote = true;
      else if (v === "false" || v === "0") filters.isRemote = false;
    }
    if (typeof req.query.keyword === "string" && req.query.keyword.length) {
      filters.keyword = req.query.keyword;
    }
    if (typeof req.query.place === "string" && req.query.place.length) {
      filters.place = req.query.place;
    }

    // Pagination params
    const parsedPage = parseInt(req.query.page as string, 10);
    filters.page =
      Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1;

    const parsedLimit = parseInt(req.query.limit as string, 10);
    const requestedLimit =
      Number.isFinite(parsedLimit) && parsedLimit > 0 ? parsedLimit : 10;
    filters.limit = Math.min(requestedLimit, 50); // cap to prevent abuse

    console.log("[controller] assembled filters:", filters);
    const result = await getAllJobsService(filters);
    console.log(
      "[controller] service returned",
      result.jobs.length,
      "jobs, pagination:",
      result.pagination,
    );

    return res.status(200).json({
      success: true,
      message: "Jobs fetched successfully",
      data: result.jobs,
      pagination: result.pagination,
    });
  } catch (error: any) {
    console.log("[controller] error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const getJobsByCompanyIdController = async (
  req: Request,
  res: Response,
): Promise<any> => {
  console.log(
    "[controller] GET /get-jobs-by-company-id — raw req.query:",
    req.query,
  );
  const query: any = {};

  if (req.query.companyId) {
    query.companyId = req.query.companyId as string;
  }

  if (req.query.status) {
    query.status = req.query.status as string;
  }

  console.log("[controller] /get-jobs-by-company-id assembled query:", query);
  try {
    const result = await getJobsByCompanyIdService(query);
    console.log(
      "[controller] /get-jobs-by-company-id service returned",
      Array.isArray(result) ? result.length : "n/a",
      "jobs",
    );
    return res.status(200).json({
      success: true,
      message: "Jobs fetched successfully",
      data: result,
    });
  } catch (error: any) {
    console.log("[controller] get jobs by id error ", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const getJobByIdController = async (
  req: Request,
  res: Response,
): Promise<any> => {
  try {
    const { id } = req.params;
    if (!id || typeof id !== "string") {
      return res
        .status(400)
        .json({ success: false, message: "Invalid job ID" });
    }
    const job = await getJobByIdService(id);

    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    return res
      .status(200)
      .json({ success: true, message: "Job fetched successfully", data: job });
  } catch (error: any) {
    console.log("[controller] getJobByIdController error:", error);
    return res
      .status(500)
      .json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
  }
};

export const saveJobController = async (
  req: Request,
  res: Response,
): Promise<any> => {
  try {
    console.log(
      "[controller] POST /save-job — params:",
      req.params,
      "body:",
      req.body,
    );
    const { userId } = req.params as { userId: string };
    const { jobId } = req.body;

    if (!jobId) {
      return res
        .status(400)
        .json({ success: false, message: "jobId is required." });
    }

    if (!userId && typeof userId !== "string") {
      return res
        .status(400)
        .json({ success: false, message: "Invalid user ID" });
    }

    const result = await saveJobService({ userId, jobId });

    if (result.error === "NOT_FOUND") {
      return res.status(404).json({ success: false, message: result.message });
    }
    if (result.error === "DUPLICATE") {
      return res.status(409).json({ success: false, message: result.message });
    }

    return res.status(201).json({
      success: true,
      message: "Job saved successfully",
      data: result.data,
    });
  } catch (error: any) {
    console.log("[controller] saveJobController error:", error);
    return res
      .status(500)
      .json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
  }
};

export const unsaveJobController = async (
  req: Request,
  res: Response,
): Promise<any> => {
  try {
    console.log("[controller] DELETE /save-job — params:", req.params);
    const { userId, jobId } = req.params;

    if (!userId && typeof userId !== "string") {
      return res
        .status(400)
        .json({ success: false, message: "Invalid user ID" });
    }

    if (!jobId && typeof jobId !== "string") {
      return res
        .status(400)
        .json({ success: false, message: "Invalid job ID" });
    }

    const result = await unsaveJobService(userId as string, jobId as string);

    if (!result) {
      return res
        .status(404)
        .json({ success: false, message: "Saved job not found." });
    }

    return res.status(200).json({
      success: true,
      message: "Job removed from saved list",
      data: result,
    });
  } catch (error: any) {
    console.log("[controller] unsaveJobController error:", error);
    return res
      .status(500)
      .json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
  }
};

export const getSavedJobsController = async (
  req: Request,
  res: Response,
): Promise<any> => {
  try {
    console.log("[controller] GET /saved-jobs — params:", req.params);
    const { userId } = req.params;

    if (!userId && typeof userId !== "string") {
      return res
        .status(400)
        .json({ success: false, message: "Invalid user ID" });
    }

    const savedJobs = await getSavedJobsService(userId as string);

    return res.status(200).json({
      success: true,
      message: "Saved jobs retrieved successfully",
      data: savedJobs,
    });
  } catch (error: any) {
    console.log("[controller] getSavedJobsController error:", error);
    return res
      .status(500)
      .json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
  }
};

export const reportJobController = async (
  req: Request,
  res: Response,
): Promise<any> => {
  try {
    console.log(
      "[controller] POST /report-job — params:",
      req.params,
      "body:",
      req.body,
    );
    const { userId } = req.params as { userId: string };
    const { jobId, reason, details } = req.body;

    if (!jobId || !reason) {
      return res
        .status(400)
        .json({ success: false, message: "jobId and reason are required." });
    }

    const result = await reportJobService({ userId, jobId, reason, details });

    if (result.error === "NOT_FOUND") {
      return res.status(404).json({ success: false, message: result.message });
    }
    if (result.error === "DUPLICATE") {
      return res.status(409).json({ success: false, message: result.message });
    }

    return res.status(201).json({
      success: true,
      message: "Job reported successfully",
      data: result.data,
    });
  } catch (error: any) {
    console.log("[controller] reportJobController error:", error);
    return res
      .status(500)
      .json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
  }
};


export const checkJobSavedController = async (req: Request, res: Response): Promise<any> => {
    try {
        console.log("[controller] GET /save-job/check — params:", req.params);
        const { userId, jobId } = req.params;

        const isSaved = await checkJobSavedService(userId as string, jobId as string);

        return res.status(200).json({
            success: true,
            message: "Saved status retrieved",
            data: { isSaved },
        });
    } catch (error: any) {
        console.log("[controller] checkJobSavedController error:", error);
        return res.status(500).json({ success: false, message: "Internal server error", error: error.message });
    }
}

export const checkJobReportedController = async (req: Request, res: Response): Promise<any> => {
    try {
        console.log("[controller] GET /report-job/check — params:", req.params);
        const { userId, jobId } = req.params;

        const isReported = await checkJobReportedService(userId as string, jobId as string);

        return res.status(200).json({
            success: true,
            message: "Reported status retrieved",
            data: { isReported },
        });
    } catch (error: any) {
        console.log("[controller] checkJobReportedController error:", error);
        return res.status(500).json({ success: false, message: "Internal server error", error: error.message });
    }
}
