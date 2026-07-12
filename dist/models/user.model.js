"use strict";
// src/models/user.model.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = exports.UserRole = void 0;
const mongoose_1 = require("mongoose");
// import { Schema, model, Document} from 'mongoose'
// 1. Define an Enum for safety
var UserRole;
(function (UserRole) {
    UserRole["APPLICANT"] = "applicant";
    UserRole["RECRUITER"] = "recruiter";
})(UserRole || (exports.UserRole = UserRole = {}));
// 3. Define the Mongoose Schema matching the interface
const userSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        trim: true,
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true, // Prevents duplicate accounts
        lowercase: true,
        trim: true,
    },
    role: {
        type: String,
        enum: Object.values(UserRole), // Restricts field to ONLY "applicant" or "recruiter"
        default: undefined, // Empty until they select their path in your onboarding
    },
}, {
    timestamps: true, // Automatically manages createdAt and updatedAt fields
});
// 4. Create and export the Model
exports.User = (0, mongoose_1.model)("User", userSchema);
