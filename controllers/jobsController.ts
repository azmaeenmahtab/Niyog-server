import { Request, Response } from 'express';
import { getAllJobsService, getJobsByCompanyIdService } from '../services/jobsService';

export const getAllJobsController = async (req: Request, res: Response): Promise<any> => {
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

        if (typeof req.query.type === 'string' && req.query.type.length) {
            filters.type = req.query.type;
        }
        if (typeof req.query.location === 'string' && req.query.location.length) {
            filters.location = req.query.location;
        }
        if (req.query.salary) {
            filters.salary = Number(req.query.salary);
        }
        if (typeof req.query.isRemote === 'string' && req.query.isRemote.length) {
            const v = req.query.isRemote.toLowerCase();
            if (v === 'true' || v === '1') filters.isRemote = true;
            else if (v === 'false' || v === '0') filters.isRemote = false;
        }
        if (typeof req.query.keyword === 'string' && req.query.keyword.length) {
            filters.keyword = req.query.keyword;
        }
        if (typeof req.query.place === 'string' && req.query.place.length) {
            filters.place = req.query.place;
        }

        // Pagination params
        const parsedPage = parseInt(req.query.page as string, 10);
        filters.page = Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1;

        const parsedLimit = parseInt(req.query.limit as string, 10);
        const requestedLimit = Number.isFinite(parsedLimit) && parsedLimit > 0 ? parsedLimit : 10;
        filters.limit = Math.min(requestedLimit, 50); // cap to prevent abuse

        console.log("[controller] assembled filters:", filters);
        const result = await getAllJobsService(filters);
        console.log("[controller] service returned", result.jobs.length, "jobs, pagination:", result.pagination);

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
            error: error.message
        });
    }
}

export const getJobsByCompanyIdController = async (req: Request, res: Response): Promise<any> => {
    console.log("[controller] GET /get-jobs-by-company-id — raw req.query:", req.query);
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
        console.log("[controller] /get-jobs-by-company-id service returned", Array.isArray(result) ? result.length : "n/a", "jobs");
        return res.status(200).json({
            success: true,
            message: "Jobs fetched successfully",
            data: result
        });
    } catch (error: any) {
        console.log("[controller] get jobs by id error ", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
}
