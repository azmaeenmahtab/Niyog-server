// src/models/user.model.ts

import { Schema, model, Document } from "mongoose";
// import { Schema, model, Document} from 'mongoose'

// 1. Define an Enum for safety
export enum UserRole {
  APPLICANT = "applicant",
  RECRUITER = "recruiter",
}

// 2. Define a TypeScript interface representing a User document in MongoDB
export interface IUser extends Document {
  name: string;
  email: string;
  role?: UserRole; // Optional initially, since they set it after registering
  createdAt: Date;
  updatedAt: Date;
}

// 3. Define the Mongoose Schema matching the interface
const userSchema = new Schema<IUser>(
  {
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
      default: undefined,            // Empty until they select their path in your onboarding
    },
  },
  {
    timestamps: true, // Automatically manages createdAt and updatedAt fields
  }
);

// 4. Create and export the Model
export const User = model<IUser>("User", userSchema);