"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateApplicationStatusService = exports.getApplicationsByJobIdService = exports.getApplicationsByUserIdService = exports.submitApplicationService = void 0;
const db_1 = require("../db/db");
const mongodb_1 = require("mongodb");
const db = db_1.client.db('niyog_db');
const applicationsCollection = db.collection('applications');
const jobsCollection = db.collection('jobs');
const submitApplicationService = async (payload) => {
    // Confirm the job actually exists and is still open before accepting an application
    const job = await jobsCollection.findOne({ _id: new mongodb_1.ObjectId(payload.jobId) });
    if (!job) {
        return { error: 'NOT_FOUND', message: 'Job not found.' };
    }
    if (job.status !== 'active') {
        return { error: 'CLOSED', message: 'This job is no longer accepting applications.' };
    }
    // Prevent the same user applying twice to the same job
    const existing = await applicationsCollection.findOne({
        jobId: payload.jobId,
        userId: payload.userId,
    });
    if (existing) {
        return { error: 'DUPLICATE', message: 'You have already applied to this job.' };
    }
    const application = {
        jobId: payload.jobId,
        userId: payload.userId,
        email: payload.email,
        companyId: job.companyId,
        recruiterId: job.recruiterId,
        jobTitle: job.title,
        status: 'applied', // applied | reviewed | shortlisted | rejected | accepted
        appliedAt: new Date().toISOString(),
    };
    const result = await applicationsCollection.insertOne(application);
    return { data: { ...application, _id: result.insertedId } };
};
exports.submitApplicationService = submitApplicationService;
const getApplicationsByUserIdService = async (userId) => {
    const applications = await applicationsCollection
        .find({ userId })
        .sort({ appliedAt: -1 })
        .toArray();
    return applications;
};
exports.getApplicationsByUserIdService = getApplicationsByUserIdService;
const getApplicationsByJobIdService = async (jobId) => {
    // Queries applications collection using the jobId string matching your database structure
    const applications = await applicationsCollection
        .find({ jobId })
        .sort({ appliedAt: -1 })
        .toArray();
    return applications;
};
exports.getApplicationsByJobIdService = getApplicationsByJobIdService;
/**
 * FEATURE 2: Update the status of a specific application using its MongoDB ObjectId
 */
const updateApplicationStatusService = async (applicationId, newStatus) => {
    const result = await applicationsCollection.findOneAndUpdate({ _id: new mongodb_1.ObjectId(applicationId) }, { $set: { status: newStatus } }, { returnDocument: 'after' } // Returns the modified application document directly
    );
    return result;
};
exports.updateApplicationStatusService = updateApplicationStatusService;
