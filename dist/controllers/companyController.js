"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllCompanies = exports.GetCompanyController = exports.RegisterCompanyController = void 0;
const { RegisterCompanyServie, getCompanyService, getAllCompaniesService } = require("../services/companyServices");
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
            message: "Companies fetched successfully",
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
