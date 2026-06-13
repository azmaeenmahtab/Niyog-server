import { client } from '../db/db';

const db = client.db('niyog_db');
const collection = db.collection('jobs');

export const getAllJobsService = async () => {
    try {
        const result = await collection.find({}).toArray();
        return result;
    } catch (error) {
        console.log("job fetch error: ", error);
        throw error;
    }
}

export const getJobsByCompanyIdService = async (query: any) => {
    try {
        const result = await collection.find(query).toArray();
        return result;
    } catch (error) {
        console.log("job fetch error: ", error);
        throw error;
    }
}
