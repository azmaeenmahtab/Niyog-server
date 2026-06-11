const { client } = require('../db/db');

const createJob = async (jobData) => {
    const db = client.db('niyog_db');
    const collection = db.collection('jobs');
    const result = await collection.insertOne(jobData);
    return result;
}

module.exports = { createJob };