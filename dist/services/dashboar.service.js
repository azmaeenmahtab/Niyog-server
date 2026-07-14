"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getApplicantStatsService = exports.getAdminStatsService = exports.getRecruiterStatsService = void 0;
const db_1 = require("../db/db");
const db = db_1.client.db('niyog_db');
const getRecruiterStatsService = async (recruiterId) => {
    try {
        console.log("[service] getRecruiterStatsService called — recruiterId:", recruiterId);
        const jobsCollection = db.collection('jobs');
        const applicationsCollection = db.collection('applications');
        const [totalJobPosts, activeJobs, jobsClosed, totalApplicants] = await Promise.all([
            jobsCollection.countDocuments({ recruiterId }),
            jobsCollection.countDocuments({ recruiterId, status: 'active' }),
            jobsCollection.countDocuments({ recruiterId, status: 'inactive' }),
            applicationsCollection.countDocuments({ recruiterId }),
        ]);
        console.log("[service] getRecruiterStatsService result:", { totalJobPosts, activeJobs, jobsClosed, totalApplicants });
        return { totalJobPosts, totalApplicants, activeJobs, jobsClosed };
    }
    catch (error) {
        console.log("[service] getRecruiterStatsService error: ", error);
        throw error;
    }
};
exports.getRecruiterStatsService = getRecruiterStatsService;
const getAdminStatsService = async () => {
    try {
        console.log("[service] getAdminStatsService called");
        const usersCollection = db.collection('user');
        const jobsCollection = db.collection('jobs');
        const companiesCollection = db.collection('companies');
        const jobReportsCollection = db.collection('jobReports');
        const [totalUsers, totalJobs, totalCompanies, pendingReports] = await Promise.all([
            usersCollection.countDocuments({}),
            jobsCollection.countDocuments({}),
            companiesCollection.countDocuments({}),
            jobReportsCollection.countDocuments({ status: 'pending' }),
        ]);
        console.log("[service] getAdminStatsService result:", { totalUsers, totalJobs, totalCompanies, pendingReports });
        return { totalUsers, totalJobs, totalCompanies, pendingReports };
    }
    catch (error) {
        console.log("[service] getAdminStatsService error: ", error);
        throw error;
    }
};
exports.getAdminStatsService = getAdminStatsService;
const getApplicantStatsService = async (userId) => {
    try {
        console.log("[service] getApplicantStatsService called — userId:", userId);
        const applicationsCollection = db.collection('applications');
        const savedJobsCollection = db.collection('savedJobs');
        const [totalApplications, savedJobs, shortlisted, pendingReview] = await Promise.all([
            applicationsCollection.countDocuments({ userId }),
            savedJobsCollection.countDocuments({ userId }),
            applicationsCollection.countDocuments({ userId, status: 'shortlisted' }),
            applicationsCollection.countDocuments({ userId, status: 'applied' }),
        ]);
        console.log("[service] getApplicantStatsService result:", { totalApplications, savedJobs, shortlisted, pendingReview });
        return { totalApplications, savedJobs, shortlisted, pendingReview };
    }
    catch (error) {
        console.log("[service] getApplicantStatsService error: ", error);
        throw error;
    }
};
exports.getApplicantStatsService = getApplicantStatsService;
