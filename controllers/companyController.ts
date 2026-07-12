import type { Request, Response } from "express";
const { RegisterCompanyServie, getCompanyService, getAllCompaniesService, deleteCompanyService, updateCompanyStatusService } = require("../services/companyServices");

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


export const getAllCompanies = async (req: Request, res: Response) => {
  try {
    const companies = await getAllCompaniesService();

    res.status(200).json({
      success: true,
      message: "Companies retrieved successfully",
      data: companies,
    });
  } catch (error) {
    console.error("getAllCompanies error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve companies",
    });
  }
};

export const updateCompanyStatusController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["approved", "declined"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Status must be 'approved' or 'declined'.",
      });
    }

    const updatedCompany = await updateCompanyStatusService(id, status);

    if (!updatedCompany) {
      return res.status(404).json({
        success: false,
        message: "Company not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: `Company ${status} successfully`,
      data: updatedCompany,
    });
  } catch (error) {
    console.error("updateCompanyStatusController error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update company status.",
    });
  }
};

export const deleteCompanyController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const deletedCompany = await deleteCompanyService(id);

    if (!deletedCompany) {
      return res.status(404).json({
        success: false,
        message: "Company not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Company deleted successfully",
      data: deletedCompany,
    });
  } catch (error) {
    console.error("deleteCompanyController error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete company.",
    });
  }
};

 