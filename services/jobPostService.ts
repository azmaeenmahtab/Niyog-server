import { client } from '../db/db';

export const createJob = async (jobData: any) => {
    const db = client.db('niyog_db');
    const collection = db.collection('jobs');
    const result = await collection.insertOne(jobData);
    return result;
}
