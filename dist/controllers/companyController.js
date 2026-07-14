"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCompanyController = exports.updateCompanyStatusController = exports.getAllCompanies = exports.GetCompanyController = exports.RegisterCompanyController = void 0;
const { RegisterCompanyServie, getCompanyService, getAllCompaniesService, deleteCompanyService, updateCompanyStatusService } = require("../services/companyServices");
const RegisterCompanyController = async (req, res) => {
    try {
        const payload = req.body;
        const result = await RegisterCompanyServie(payload);
        return res.status(201).json({
            success: true,
            message: "Company registered successfully",
            data: {
                insertedId: result.insertedId,
                company: payload,
            },
        });
    }
    catch (error) {
        console.error("register company error", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};
exports.RegisterCompanyController = RegisterCompanyController;
const GetCompanyController = async (req, res) => {
    try {
        const recruiterId = typeof req.query.recruiterId === "string"
            ? req.query.recruiterId
            : undefined;
        const company = await getCompanyService(recruiterId);
        return res.status(200).json({
            success: true,
            message: "Company fetched successfully",
            data: company,
        });
    }
    catch (error) {
        console.error("get company error", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};
exports.GetCompanyController = GetCompanyController;
const getAllCompanies = async (req, res) => {
    try {
        const companies = await getAllCompaniesService();
        res.status(200).json({
            success: true,
            message: "Companies retrieved successfully",
            data: companies,
        });
    }
    catch (error) {
        console.error("getAllCompanies error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to retrieve companies",
        });
    }
};
exports.getAllCompanies = getAllCompanies;
const updateCompanyStatusController = async (req, res) => {
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
    }
    catch (error) {
        console.error("updateCompanyStatusController error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to update company status.",
        });
    }
};
exports.updateCompanyStatusController = updateCompanyStatusController;
const deleteCompanyController = async (req, res) => {
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
    }
    catch (error) {
        console.error("deleteCompanyController error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to delete company.",
        });
    }
};
exports.deleteCompanyController = deleteCompanyController;
