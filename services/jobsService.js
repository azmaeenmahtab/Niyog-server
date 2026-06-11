const { client } = require('../db/db');
const db = client.db('niyog_db');
const collection = db.collection('jobs');
const getAllJobsService = async () => {
    try {

        const result = await collection.find({}).toArray();
        return result;
    } catch (error) {
        console.log("job fetch error: ", error);
        return error;
    }
}


const getJobsByCompanyIdService = async (query) => {
    try {
        const result = await collection.find(query).toArray();
        return result;
    } catch (error) {
        console.log("job fetch error: ", error);
        return error;
    }

}
module.exports = { getAllJobsService, getJobsByCompanyIdService }