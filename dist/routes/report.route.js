"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const verifyJWTToken_1 = require("../middlewares/verifyJWTToken");
const router = express_1.default.Router();
const report_controller_1 = require("../controllers/report.controller");
router.get('/admin/reports', verifyJWTToken_1.validateToken, /* requireAdmin, */ report_controller_1.getAllReportsController);
router.patch('/admin/reports/:reportId/dismiss', verifyJWTToken_1.validateToken, /* requireAdmin, */ report_controller_1.dismissReportController);
router.patch('/admin/reports/:reportId/deactivate-job', verifyJWTToken_1.validateToken, /* requireAdmin, */ report_controller_1.deactivateReportedJobController);
router.delete('/admin/reports/:reportId/job', verifyJWTToken_1.validateToken, /* requireAdmin, */ report_controller_1.deleteReportedJobController);
exports.default = router;
