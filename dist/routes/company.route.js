"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const companyController_1 = require("../controllers/companyController");
const router = (0, express_1.Router)();
router.post('/register-company', companyController_1.RegisterCompanyController);
router.get('/recruiter-company', companyController_1.GetCompanyController);
router.get('/admin/company/all', companyController_1.getAllCompanies);
exports.default = router;
