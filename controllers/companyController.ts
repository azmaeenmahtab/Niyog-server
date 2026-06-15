import type { Request, Response } from "express";
const { RegisterCompanyServie, getCompanyService } = require("../services/companyServices");

interface RegisterCompanyPayload {
  name: string;
  industry: string;
  website: string;
  location: string;
  employeeRange: string;
  description: string;
  logoUrl: string | null;
  recruiterId: string;
}

export const RegisterCompanyController = async (req: Request, res: Response): Promise<any> => {
    try {
        const payload = req.body as RegisterCompanyPayload;

        const result = await RegisterCompanyServie(payload);

        return res.status(201).json({
            success: true,
            message: "Company registered successfully",
            data: {
                insertedId: result.insertedId,
                company: payload,
            },
        });
    } catch (error: any) {
        console.error("register company error", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};

export const GetCompanyController = async (req: Request, res: Response): Promise<any> => {
    try {
        const recruiterId = typeof req.query.recruiterId === "string"
            ? req.query.recruiterId
            : undefined;
        const company = await getCompanyService(recruiterId);

        return res.status(200).json({
            success: true,
            message: "Companies fetched successfully",
            data: company,
        });
    } catch (error: any) {
        console.error("get company error", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};

 