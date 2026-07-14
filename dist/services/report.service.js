"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateReportStatusService = exports.getAllReportsService = void 0;
const mongodb_1 = require("mongodb");
const db_1 = require("../db/db");
const db = db_1.client.db("niyog_db");
const collection = db.collection("jobs");
const jobReportsCollection = db.collection("jobReports");
const getAllReportsService = async (status) => {
    try {
        console.log("[service] getAllReportsService called with status:", status);
        const query = {};
        if (status && status !== 'all') {
            query.status = status;
        }
        const reports = await jobReportsCollection
            .find(query)
            .sort({ reportedAt: -1 })
            .toArray();
        console.log("[service] getAllReportsService returned", reports.length, "reports");
        return reports;
    }
    catch (error) {
        console.log("[service] getAllReportsService error: ", error);
        throw error;
    }
};
exports.getAllReportsService = getAllReportsService;
const updateReportStatusService = async (reportId, status) => {
    try {
        console.log("[service] updateReportStatusService called — reportId:", reportId, "status:", status);
        const result = await jobReportsCollection.findOneAndUpdate({ _id: new mongodb_1.ObjectId(reportId) }, { $set: { status, updatedAt: new Date().toISOString() } }, { returnDocument: 'after' });
        console.log("[service] updateReportStatusService result:", result ? "updated" : "not found");
        return result;
    }
    catch (error) {
        console.log("[service] updateReportStatusService error: ", error);
        throw error;
    }
};
exports.updateReportStatusService = updateReportStatusService;
