import { ObjectId } from "mongodb"; // Import ObjectId from the native driver
import { client } from '../db/db';

const db = client.db('niyog_db');
const collection = db.collection('user');

export const userService = {
  setUserRole: async (userId: string, role: string) => {
    // 1. Convert the string userId into a MongoDB ObjectId
    const objectId = new ObjectId(userId);

    // 2. Perform the update directly on your MongoDB collection
    const result = await collection.findOneAndUpdate(
      { _id: objectId },           // Query filter
      { $set: { role: role } },    // Update operation
      { returnDocument: 'after' }  // Option to return the modified document instead of original
    );

    // 3. Return the updated user document (or null if not found)
    return result;
  }
};