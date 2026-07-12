"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getJobsByCompanyIdService = exports.getAllJobsService = void 0;
const db_1 = require("../db/db");
const db = db_1.client.db('niyog_db');
const collection = db.collection('jobs');
function parseSalary(salary) {
    if (typeof salary !== 'string') {
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
        const jobs = await collection.find({}).toArray();
        console.log("[service] fetched", jobs.length, "jobs from db");
        const type = filters.type?.toLowerCase() ?? '';
        const location = filters.location?.toLowerCase() ?? '';
        const minSalary = filters.salary ?? 0;
        const keyword = filters.keyword?.toLowerCase() ?? '';
        const place = filters.place?.toLowerCase() ?? '';
        const isRemote = filters.isRemote; // boolean | undefined
        console.log("[service] normalized — type:", JSON.stringify(type), "location:", JSON.stringify(location), "minSalary:", minSalary, "keyword:", JSON.stringify(keyword), "place:", JSON.stringify(place), "isRemote:", isRemote);
        let kept = 0;
        let dropped = 0;
        const result = jobs.filter((job) => {
            if (type && String(job.type ?? '').toLowerCase() !== type) {
                dropped++;
                return false;
            }
            // Boolean isRemote filter (DB stores isRemote as a boolean)
            if (isRemote === true && job.isRemote !== true) {
                dropped++;
                return false;
            }
            if (isRemote === false && job.isRemote === true) {
                dropped++;
                return false;
            }
            // Legacy string-based location filter (kept for backwards compatibility
            // with any job docs that don't have isRemote set)
            if (location === 'remote') {
                if (job.isRemote === true) { /* matches */ }
                else if (!String(job.location ?? '').toLowerCase().includes('remote')) {
                    dropped++;
                    return false;
                }
            }
            else if (location === 'on-site') {
                if (job.isRemote === false) { /* matches */ }
                else if (String(job.location ?? '').toLowerCase().includes('remote')) {
                    dropped++;
                    return false;
                }
            }
            if (minSalary > 0) {
                const jobMinSalary = job.salaryMin != null ? Number(job.salaryMin) : parseSalary(job.salary);
                if (jobMinSalary === null || Number.isNaN(jobMinSalary)) {
                    // can't determine → don't exclude it
                }
                else if (jobMinSalary < minSalary) {
                    console.log("[service]   ✗ salary drop — job", job._id, "minSalary:", jobMinSalary, "< filter:", minSalary, "title:", job.title);
                    dropped++;
                    return false;
                }
            }
            if (keyword && !String(job.title ?? '').toLowerCase().includes(keyword)) {
                dropped++;
                return false;
            }
            if (place && !String(job.location ?? '').toLowerCase().includes(place)) {
                dropped++;
                return false;
            }
            kept++;
            return true;
        });
        console.log("[service] filter result — kept:", kept, "dropped:", dropped, "returned:", result.length);
        return result;
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
