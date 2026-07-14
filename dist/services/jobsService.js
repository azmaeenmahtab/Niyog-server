"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateJobService = exports.deleteJobService = exports.deactivateJobService = exports.checkJobReportedService = exports.checkJobSavedService = exports.reportJobService = exports.getSavedJobsService = exports.unsaveJobService = exports.saveJobService = exports.getJobByIdService = exports.getJobsByCompanyIdService = exports.getAllJobsService = void 0;
const mongodb_1 = require("mongodb");
const db_1 = require("../db/db");
const db = db_1.client.db("niyog_db");
const collection = db.collection("jobs");
const savedJobsCollection = db.collection("savedJobs");
const jobReportsCollection = db.collection("jobReports");
// Prevents user input from being interpreted as regex syntax
function escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function parseSalary(salary) {
    if (typeof salary !== "string") {
        console.log("[service] parseSalary: non-string input:", typeof salary, JSON.stringify(salary));
        return null;
    }
    const match = salary.match(/(\d+)/);
    const result = match ? Number(match[0]) : null;
    console.log("[service] parseSalary:", JSON.stringify(salary), "→", result);
    return result;
}
const getAllJobsService = async (filters = {}) => {
    try {
        console.log("[service] getAllJobsService called with filters:", filters);
        const page = filters.page && filters.page > 0 ? filters.page : 1;
        const limit = filters.limit && filters.limit > 0 ? filters.limit : 10;
        const skip = (page - 1) * limit;
        const matchConditions = [];
        if (filters.type) {
            matchConditions.push({
                type: { $regex: `^${escapeRegex(filters.type)}$`, $options: "i" },
            });
        }
        if (filters.status) {
            matchConditions.push({ status: filters.status });
        }
        // Strict isRemote filter (only applied when explicitly passed)
        if (filters.isRemote === true) {
            matchConditions.push({ isRemote: true });
        }
        else if (filters.isRemote === false) {
            matchConditions.push({ isRemote: { $ne: true } });
        }
        // Legacy "location" string filter — same OR logic as the original in-memory version
        const location = filters.location?.toLowerCase();
        if (location === "remote") {
            matchConditions.push({
                $or: [
                    { isRemote: true },
                    { location: { $regex: "remote", $options: "i" } },
                ],
            });
        }
        else if (location === "on-site") {
            matchConditions.push({
                $or: [
                    { isRemote: false },
                    { location: { $not: { $regex: "remote", $options: "i" } } },
                ],
            });
        }
        if (filters.keyword) {
            matchConditions.push({
                title: { $regex: escapeRegex(filters.keyword), $options: "i" },
            });
        }
        if (filters.place) {
            matchConditions.push({
                location: { $regex: escapeRegex(filters.place), $options: "i" },
            });
        }
        const pipeline = [];
        if (matchConditions.length) {
            pipeline.push({ $match: { $and: matchConditions } });
        }
        // Salary lives either as a number (salaryMin) or embedded in a string (e.g. "$50k+"),
        // so we compute an effective numeric value before filtering/sorting on it.
        if (filters.salary && filters.salary > 0) {
            pipeline.push({
                $addFields: {
                    effectiveMinSalary: {
                        $cond: [
                            { $ifNull: ["$salaryMin", false] },
                            { $toDouble: "$salaryMin" },
                            {
                                $let: {
                                    vars: {
                                        m: {
                                            $regexFind: {
                                                input: { $toString: { $ifNull: ["$salary", ""] } },
                                                regex: "\\d+",
                                            },
                                        },
                                    },
                                    in: {
                                        $cond: [
                                            { $ne: ["$$m", null] },
                                            { $toDouble: "$$m.match" },
                                            null,
                                        ],
                                    },
                                },
                            },
                        ],
                    },
                },
            });
            pipeline.push({
                $match: {
                    $or: [
                        { effectiveMinSalary: null }, // can't determine → don't exclude, same as before
                        { effectiveMinSalary: { $gte: filters.salary } },
                    ],
                },
            });
        }
        pipeline.push({
            $facet: {
                data: [
                    { $sort: { postedAt: -1, _id: -1 } }, // _id as tiebreaker/fallback (ObjectId encodes creation time)
                    { $skip: skip },
                    { $limit: limit },
                ],
                totalCount: [{ $count: "count" }],
            },
        });
        console.log("[service] running aggregation pipeline:", JSON.stringify(pipeline));
        const result = await collection.aggregate(pipeline).toArray();
        const jobs = result[0]?.data ?? [];
        const totalCount = result[0]?.totalCount?.[0]?.count ?? 0;
        const totalPages = Math.max(1, Math.ceil(totalCount / limit));
        console.log("[service] pagination — page:", page, "limit:", limit, "totalCount:", totalCount, "totalPages:", totalPages, "returned:", jobs.length);
        return {
            jobs,
            pagination: {
                totalCount,
                totalPages,
                currentPage: page,
                limit,
            },
        };
    }
    catch (error) {
        console.log("[service] job fetch error: ", error);
        throw error;
    }
};
exports.getAllJobsService = getAllJobsService;
const getJobsByCompanyIdService = async (query) => {
    try {
        console.log("[service] getJobsByCompanyIdService called with query:", query);
        const result = await collection.find(query).toArray();
        console.log("[service] getJobsByCompanyIdService returned", result.length, "jobs");
        return result;
    }
    catch (error) {
        console.log("[service] getJobsByCompanyIdService error: ", error);
        throw error;
    }
};
exports.getJobsByCompanyIdService = getJobsByCompanyIdService;
const getJobByIdService = async (jobId) => {
    try {
        console.log("[service] getJobByIdService called with id:", jobId);
        const job = await collection.findOne({ _id: new mongodb_1.ObjectId(jobId) });
        console.log("[service] getJobByIdService found:", job ? "yes" : "no");
        return job;
    }
    catch (error) {
        console.log("[service] getJobByIdService error: ", error);
        throw error;
    }
};
exports.getJobByIdService = getJobByIdService;
const saveJobService = async (payload) => {
    try {
        console.log("[service] saveJobService called with:", payload);
        const job = await collection.findOne({ _id: new mongodb_1.ObjectId(payload.jobId) });
        if (!job) {
            console.log("[service] saveJobService — job not found:", payload.jobId);
            return { error: "NOT_FOUND", message: "Job not found." };
        }
        const existing = await savedJobsCollection.findOne({
            userId: payload.userId,
            jobId: payload.jobId,
        });
        if (existing) {
            console.log("[service] saveJobService — already saved:", payload);
            return { error: "DUPLICATE", message: "Job already saved." };
        }
        const savedJob = {
            userId: payload.userId,
            jobId: payload.jobId,
            jobTitle: job.title,
            companyName: job.companyName,
            companyLogoUrl: job.companyLogoUrl ?? null,
            savedAt: new Date().toISOString(),
        };
        const result = await savedJobsCollection.insertOne(savedJob);
        console.log("[service] saveJobService — inserted:", result.insertedId);
        return { data: { ...savedJob, _id: result.insertedId } };
    }
    catch (error) {
        console.log("[service] saveJobService error: ", error);
        throw error;
    }
};
exports.saveJobService = saveJobService;
const unsaveJobService = async (userId, jobId) => {
    try {
        console.log("[service] unsaveJobService called — userId:", userId, "jobId:", jobId);
        const result = await savedJobsCollection.findOneAndDelete({
            userId,
            jobId,
        });
        console.log("[service] unsaveJobService — deleted:", result ? "yes" : "no match");
        return result;
    }
    catch (error) {
        console.log("[service] unsaveJobService error: ", error);
        throw error;
    }
};
exports.unsaveJobService = unsaveJobService;
const getSavedJobsService = async (userId) => {
    try {
        console.log("[service] getSavedJobsService called with userId:", userId);
        const savedJobs = await savedJobsCollection
            .find({ userId })
            .sort({ savedAt: -1 })
            .toArray();
        console.log("[service] getSavedJobsService returned", savedJobs.length, "saved jobs");
        return savedJobs;
    }
    catch (error) {
        console.log("[service] getSavedJobsService error: ", error);
        throw error;
    }
};
exports.getSavedJobsService = getSavedJobsService;
const reportJobService = async (payload) => {
    try {
        console.log("[service] reportJobService called with:", payload);
        const job = await collection.findOne({ _id: new mongodb_1.ObjectId(payload.jobId) });
        if (!job) {
            console.log("[service] reportJobService — job not found:", payload.jobId);
            return { error: "NOT_FOUND", message: "Job not found." };
        }
        const existing = await jobReportsCollection.findOne({
            userId: payload.userId,
            jobId: payload.jobId,
        });
        if (existing) {
            console.log("[service] reportJobService — already reported:", payload);
            return {
                error: "DUPLICATE",
                message: "You have already reported this job.",
            };
        }
        const report = {
            userId: payload.userId,
            jobId: payload.jobId,
            jobTitle: job.title,
            reason: payload.reason,
            details: payload.details ?? "",
            status: "pending", // pending | reviewed | dismissed
            reportedAt: new Date().toISOString(),
        };
        const result = await jobReportsCollection.insertOne(report);
        console.log("[service] reportJobService — inserted:", result.insertedId);
        return { data: { ...report, _id: result.insertedId } };
    }
    catch (error) {
        console.log("[service] reportJobService error: ", error);
        throw error;
    }
};
exports.reportJobService = reportJobService;
const checkJobSavedService = async (userId, jobId) => {
    try {
        console.log("[service] checkJobSavedService called — userId:", userId, "jobId:", jobId);
        const saved = await savedJobsCollection.findOne({ userId, jobId });
        console.log("[service] checkJobSavedService result:", saved ? "saved" : "not saved");
        return Boolean(saved);
    }
    catch (error) {
        console.log("[service] checkJobSavedService error: ", error);
        throw error;
    }
};
exports.checkJobSavedService = checkJobSavedService;
const checkJobReportedService = async (userId, jobId) => {
    try {
        console.log("[service] checkJobReportedService called — userId:", userId, "jobId:", jobId);
        const reported = await jobReportsCollection.findOne({ userId, jobId });
        console.log("[service] checkJobReportedService result:", reported ? "reported" : "not reported");
        return Boolean(reported);
    }
    catch (error) {
        console.log("[service] checkJobReportedService error: ", error);
        throw error;
    }
};
exports.checkJobReportedService = checkJobReportedService;
const deactivateJobService = async (jobId) => {
    try {
        console.log("[service] deactivateJobService called — jobId:", jobId);
        const result = await collection.findOneAndUpdate({ _id: new mongodb_1.ObjectId(jobId) }, { $set: { status: 'inactive', updatedAt: new Date().toISOString() } }, { returnDocument: 'after' });
        console.log("[service] deactivateJobService result:", result ? "updated" : "not found");
        return result;
    }
    catch (error) {
        console.log("[service] deactivateJobService error: ", error);
        throw error;
    }
};
exports.deactivateJobService = deactivateJobService;
const deleteJobService = async (jobId) => {
    try {
        console.log("[service] deleteJobService called — jobId:", jobId);
        const result = await collection.findOneAndDelete({ _id: new mongodb_1.ObjectId(jobId) });
        console.log("[service] deleteJobService result:", result ? "deleted" : "not found");
        return result;
    }
    catch (error) {
        console.log("[service] deleteJobService error: ", error);
        throw error;
    }
};
exports.deleteJobService = deleteJobService;
const updateJobService = async (jobId, payload) => {
    try {
        console.log("[service] updateJobService called — jobId:", jobId, "payload:", payload);
        // Strip undefined fields so we only $set what was actually provided
        const updateFields = {};
        Object.entries(payload).forEach(([key, value]) => {
            if (value !== undefined)
                updateFields[key] = value;
        });
        updateFields.updatedAt = new Date().toISOString();
        const result = await collection.findOneAndUpdate({ _id: new mongodb_1.ObjectId(jobId) }, { $set: updateFields }, { returnDocument: 'after' });
        console.log("[service] updateJobService result:", result ? "updated" : "not found");
        return result;
    }
    catch (error) {
        console.log("[service] updateJobService error: ", error);
        throw error;
    }
};
exports.updateJobService = updateJobService;
