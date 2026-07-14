import express from "express";
import { Router } from "express";
const router = express.Router();

import { getAllReportsController, dismissReportController, deactivateReportedJobController, deleteReportedJobController } from "../controllers/report.controller";

router.get('/admin/reports', /* requireAdmin, */ getAllReportsController);
router.patch('/admin/reports/:reportId/dismiss', /* requireAdmin, */ dismissReportController);
router.patch('/admin/reports/:reportId/deactivate-job', /* requireAdmin, */ deactivateReportedJobController);
router.delete('/admin/reports/:reportId/job', /* requireAdmin, */ deleteReportedJobController);


export default router;