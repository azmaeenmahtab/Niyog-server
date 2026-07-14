import { ObjectId } from 'mongodb';
import { client } from "../db/db";

const db = client.db("niyog_db");
const collection = db.collection("jobs");
const jobReportsCollection = db.collection("jobReports");

export const getAllReportsService = async (status?: string) => {
    try {
        console.log("[service] getAllReportsService called with status:", status);
        const query: any = {};
        if (status && status !== 'all') {
            query.status = status;
        }

        const reports = await jobReportsCollection
            .find(query)
            .sort({ reportedAt: -1 })
            .toArray();

        console.log("[service] getAllReportsService returned", reports.length, "reports");
        return reports;
    } catch (error) {
        console.log("[service] getAllReportsService error: ", error);
        throw error;
    }
}

export const updateReportStatusService = async (reportId: string, status: string) => {
    try {
        console.log("[service] updateReportStatusService called — reportId:", reportId, "status:", status);
        const result = await jobReportsCollection.findOneAndUpdate(
            { _id: new ObjectId(reportId) },
            { $set: { status, updatedAt: new Date().toISOString() } },
            { returnDocument: 'after' }
        );
        console.log("[service] updateReportStatusService result:", result ? "updated" : "not found");
        return result;
    } catch (error) {
        console.log("[service] updateReportStatusService error: ", error);
        throw error;
    }
}