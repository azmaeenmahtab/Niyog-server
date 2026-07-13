import { client } from '../db/db';
import { ObjectId } from 'mongodb';


const db = client.db('niyog_db');
const applicationsCollection = db.collection('applications');
const jobsCollection = db.collection('jobs');

export interface SubmitApplicationPayload {
  userId: string;
  jobId: string;
  email: string;
}

export const submitApplicationService = async (payload: SubmitApplicationPayload) => {


  // Confirm the job actually exists and is still open before accepting an application
  const job = await jobsCollection.findOne({ _id: new ObjectId(payload.jobId) });
  if (!job) {
    return { error: 'NOT_FOUND', message: 'Job not found.' };
  }
  if (job.status !== 'active') {
    return { error: 'CLOSED', message: 'This job is no longer accepting applications.' };
  }

  // Prevent the same user applying twice to the same job
  const existing = await applicationsCollection.findOne({
    jobId: payload.jobId,
    userId: payload.userId,
  });
  if (existing) {
    return { error: 'DUPLICATE', message: 'You have already applied to this job.' };
  }

  const application = {
    jobId: payload.jobId,
    userId: payload.userId,
    email: payload.email,
    companyId: job.companyId,
    recruiterId: job.recruiterId,
    jobTitle: job.title,
    status: 'applied', // applied | reviewed | shortlisted | rejected | accepted
    appliedAt: new Date().toISOString(),
  };

  const result = await applicationsCollection.insertOne(application);
  return { data: { ...application, _id: result.insertedId } };
};


export const getApplicationsByUserIdService = async (userId: string) => {

  const applications = await applicationsCollection
    .find({ userId })
    .sort({ appliedAt: -1 })
    .toArray();

  return applications;
};


export const getApplicationsByJobIdService = async (jobId: string) => {
  // Queries applications collection using the jobId string matching your database structure
  const applications = await applicationsCollection
    .find({ jobId })
    .sort({ appliedAt: -1 })
    .toArray();

  return applications;
};

/**
 * FEATURE 2: Update the status of a specific application using its MongoDB ObjectId
 */
export const updateApplicationStatusService = async (applicationId: string, newStatus: string) => {
  const result = await applicationsCollection.findOneAndUpdate(
    { _id: new ObjectId(applicationId) },
    { $set: { status: newStatus } },
    { returnDocument: 'after' } // Returns the modified application document directly
  );

  return result;
};