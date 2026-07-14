import express from "express";
import { Router } from "express";
import { validateToken } from '../middlewares/verifyJWTToken';
const router = express.Router();

import { getAllReportsController, dismissReportController, deactivateReportedJobController, deleteReportedJobController } from "../controllers/report.controller";

router.get('/admin/reports', validateToken, /* requireAdmin, */ getAllReportsController);
router.patch('/admin/reports/:reportId/dismiss', validateToken, /* requireAdmin, */ dismissReportController);
router.patch('/admin/reports/:reportId/deactivate-job', validateToken, /* requireAdmin, */ deactivateReportedJobController);
router.delete('/admin/reports/:reportId/job', validateToken, /* requireAdmin, */ deleteReportedJobController);


export default router;