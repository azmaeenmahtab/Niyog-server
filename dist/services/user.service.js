"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userService = void 0;
const mongodb_1 = require("mongodb"); // Import ObjectId from the native driver
const db_1 = require("../db/db");
const db = db_1.client.db('niyog_db');
const collection = db.collection('user');
exports.userService = {
    setUserRole: async (userId, role) => {
        // 1. Convert the string userId into a MongoDB ObjectId
        const objectId = new mongodb_1.ObjectId(userId);
        // 2. Perform the update directly on your MongoDB collection
        const result = await collection.findOneAndUpdate({ _id: objectId }, // Query filter
        { $set: { role: role } }, // Update operation
        { returnDocument: 'after' } // Option to return the modified document instead of original
        );
        // 3. Return the updated user document (or null if not found)
        return result;
    }
};
