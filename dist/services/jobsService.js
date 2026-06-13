"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getJobsByCompanyIdService = exports.getAllJobsService = void 0;
const db_1 = require("../db/db");
const db = db_1.client.db('niyog_db');
const collection = db.collection('jobs');
const getAllJobsService = async () => {
    try {
        const result = await collection.find({}).toArray();
        return result;
    }
    catch (error) {
        console.log("job fetch error: ", error);
        throw error;
    }
};
exports.getAllJobsService = getAllJobsService;
const getJobsByCompanyIdService = async (query) => {
    try {
        const result = await collection.find(query).toArray();
        return result;
    }
    catch (error) {
        console.log("job fetch error: ", error);
        throw error;
    }
};
exports.getJobsByCompanyIdService = getJobsByCompanyIdService;
