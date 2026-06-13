"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createJob = void 0;
const db_1 = require("../db/db");
const createJob = async (jobData) => {
    const db = db_1.client.db('niyog_db');
    const collection = db.collection('jobs');
    const result = await collection.insertOne(jobData);
    return result;
};
exports.createJob = createJob;
