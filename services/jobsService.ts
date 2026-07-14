import { ObjectId } from "mongodb";
import { client } from "../db/db";

const db = client.db("niyog_db");
const collection = db.collection("jobs");
const savedJobsCollection = db.collection("savedJobs");
const jobReportsCollection = db.collection("jobReports");

export interface JobFilters {
  type?: string;
  location?: string;
  salary?: number;
  keyword?: string;
  place?: string;
  isRemote?: boolean;
  page?: number;
  limit?: number;
}

// Prevents user input from being interpreted as regex syntax
function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function parseSalary(salary: string): number | null {
  if (typeof salary !== "string") {
    console.log(
      "[service] parseSalary: non-string input:",
      typeof salary,
      JSON.stringify(salary),
    );
    return null;
  }
  const match = salary.match(/(\d+)/);
  const result = match ? Number(match[0]) : null;
  console.log("[service] parseSalary:", JSON.stringify(salary), "→", result);
  return result;
}

export const getAllJobsService = async (filters: JobFilters = {}) => {
  try {
    console.log("[service] getAllJobsService called with filters:", filters);

    const page = filters.page && filters.page > 0 ? filters.page : 1;
    const limit = filters.limit && filters.limit > 0 ? filters.limit : 10;
    const skip = (page - 1) * limit;

    const matchConditions: any[] = [];

    if (filters.type) {
      matchConditions.push({
        type: { $regex: `^${escapeRegex(filters.type)}$`, $options: "i" },
      });
    }

    // Strict isRemote filter (only applied when explicitly passed)
    if (filters.isRemote === true) {
      matchConditions.push({ isRemote: true });
    } else if (filters.isRemote === false) {
      matchConditions.push({ isRemote: { $ne: true } });
    }

    // Legacy "location" string filter — same OR logic as the original in-memory version
    const location = filters.location?.toLowerCase();
    if (location === "remote") {
      matchConditions.push({
        $or: [
          { isRemote: true },
          { location: { $regex: "remote", $options: "i" } },
        ],
      });
    } else if (location === "on-site") {
      matchConditions.push({
        $or: [
          { isRemote: false },
          { location: { $not: { $regex: "remote", $options: "i" } } },
        ],
      });
    }

    if (filters.keyword) {
      matchConditions.push({
        title: { $regex: escapeRegex(filters.keyword), $options: "i" },
      });
    }

    if (filters.place) {
      matchConditions.push({
        location: { $regex: escapeRegex(filters.place), $options: "i" },
      });
    }

    const pipeline: any[] = [];

    if (matchConditions.length) {
      pipeline.push({ $match: { $and: matchConditions } });
    }

    // Salary lives either as a number (salaryMin) or embedded in a string (e.g. "$50k+"),
    // so we compute an effective numeric value before filtering/sorting on it.
    if (filters.salary && filters.salary > 0) {
      pipeline.push({
        $addFields: {
          effectiveMinSalary: {
            $cond: [
              { $ifNull: ["$salaryMin", false] },
              { $toDouble: "$salaryMin" },
              {
                $let: {
                  vars: {
                    m: {
                      $regexFind: {
                        input: { $toString: { $ifNull: ["$salary", ""] } },
                        regex: "\\d+",
                      },
                    },
                  },
                  in: {
                    $cond: [
                      { $ne: ["$$m", null] },
                      { $toDouble: "$$m.match" },
                      null,
                    ],
                  },
                },
              },
            ],
          },
        },
      });

      pipeline.push({
        $match: {
          $or: [
            { effectiveMinSalary: null }, // can't determine → don't exclude, same as before
            { effectiveMinSalary: { $gte: filters.salary } },
          ],
        },
      });
    }

    pipeline.push({
      $facet: {
        data: [
          { $sort: { postedAt: -1, _id: -1 } }, // _id as tiebreaker/fallback (ObjectId encodes creation time)
          { $skip: skip },
          { $limit: limit },
        ],
        totalCount: [{ $count: "count" }],
      },
    });

    console.log(
      "[service] running aggregation pipeline:",
      JSON.stringify(pipeline),
    );

    const result = await collection.aggregate(pipeline).toArray();

    const jobs = result[0]?.data ?? [];
    const totalCount = result[0]?.totalCount?.[0]?.count ?? 0;
    const totalPages = Math.max(1, Math.ceil(totalCount / limit));

    console.log(
      "[service] pagination — page:",
      page,
      "limit:",
      limit,
      "totalCount:",
      totalCount,
      "totalPages:",
      totalPages,
      "returned:",
      jobs.length,
    );

    return {
      jobs,
      pagination: {
        totalCount,
        totalPages,
        currentPage: page,
        limit,
      },
    };
  } catch (error) {
    console.log("[service] job fetch error: ", error);
    throw error;
  }
};

export const getJobsByCompanyIdService = async (query: any) => {
  try {
    console.log(
      "[service] getJobsByCompanyIdService called with query:",
      query,
    );
    const result = await collection.find(query).toArray();
    console.log(
      "[service] getJobsByCompanyIdService returned",
      result.length,
      "jobs",
    );
    return result;
  } catch (error) {
    console.log("[service] getJobsByCompanyIdService error: ", error);
    throw error;
  }
};

export const getJobByIdService = async (jobId: string) => {
  try {
    console.log("[service] getJobByIdService called with id:", jobId);
    const job = await collection.findOne({ _id: new ObjectId(jobId) });
    console.log("[service] getJobByIdService found:", job ? "yes" : "no");
    return job;
  } catch (error) {
    console.log("[service] getJobByIdService error: ", error);
    throw error;
  }
};

export interface SaveJobPayload {
  userId: string;
  jobId: string;
}

export const saveJobService = async (payload: SaveJobPayload) => {
  try {
    console.log("[service] saveJobService called with:", payload);

    const job = await collection.findOne({ _id: new ObjectId(payload.jobId) });
    if (!job) {
      console.log("[service] saveJobService — job not found:", payload.jobId);
      return { error: "NOT_FOUND", message: "Job not found." };
    }

    const existing = await savedJobsCollection.findOne({
      userId: payload.userId,
      jobId: payload.jobId,
    });
    if (existing) {
      console.log("[service] saveJobService — already saved:", payload);
      return { error: "DUPLICATE", message: "Job already saved." };
    }

    const savedJob = {
      userId: payload.userId,
      jobId: payload.jobId,
      jobTitle: job.title,
      companyName: job.companyName,
      companyLogoUrl: job.companyLogoUrl ?? null,
      savedAt: new Date().toISOString(),
    };

    const result = await savedJobsCollection.insertOne(savedJob);
    console.log("[service] saveJobService — inserted:", result.insertedId);
    return { data: { ...savedJob, _id: result.insertedId } };
  } catch (error) {
    console.log("[service] saveJobService error: ", error);
    throw error;
  }
};

export const unsaveJobService = async (userId: string, jobId: string) => {
  try {
    console.log(
      "[service] unsaveJobService called — userId:",
      userId,
      "jobId:",
      jobId,
    );
    const result = await savedJobsCollection.findOneAndDelete({
      userId,
      jobId,
    });
    console.log(
      "[service] unsaveJobService — deleted:",
      result ? "yes" : "no match",
    );
    return result;
  } catch (error) {
    console.log("[service] unsaveJobService error: ", error);
    throw error;
  }
};

export const getSavedJobsService = async (userId: string) => {
  try {
    console.log("[service] getSavedJobsService called with userId:", userId);
    const savedJobs = await savedJobsCollection
      .find({ userId })
      .sort({ savedAt: -1 })
      .toArray();
    console.log(
      "[service] getSavedJobsService returned",
      savedJobs.length,
      "saved jobs",
    );
    return savedJobs;
  } catch (error) {
    console.log("[service] getSavedJobsService error: ", error);
    throw error;
  }
};

export interface ReportJobPayload {
  userId: string;
  jobId: string;
  reason: string;
  details?: string;
}

export const reportJobService = async (payload: ReportJobPayload) => {
  try {
    console.log("[service] reportJobService called with:", payload);

    const job = await collection.findOne({ _id: new ObjectId(payload.jobId) });
    if (!job) {
      console.log("[service] reportJobService — job not found:", payload.jobId);
      return { error: "NOT_FOUND", message: "Job not found." };
    }

    const existing = await jobReportsCollection.findOne({
      userId: payload.userId,
      jobId: payload.jobId,
    });
    if (existing) {
      console.log("[service] reportJobService — already reported:", payload);
      return {
        error: "DUPLICATE",
        message: "You have already reported this job.",
      };
    }

    const report = {
      userId: payload.userId,
      jobId: payload.jobId,
      jobTitle: job.title,
      reason: payload.reason,
      details: payload.details ?? "",
      status: "pending", // pending | reviewed | dismissed
      reportedAt: new Date().toISOString(),
    };

    const result = await jobReportsCollection.insertOne(report);
    console.log("[service] reportJobService — inserted:", result.insertedId);
    return { data: { ...report, _id: result.insertedId } };
  } catch (error) {
    console.log("[service] reportJobService error: ", error);
    throw error;
  }
};


export const checkJobSavedService = async (userId: string, jobId: string) => {
    try {
        console.log("[service] checkJobSavedService called — userId:", userId, "jobId:", jobId);
        const saved = await savedJobsCollection.findOne({ userId, jobId });
        console.log("[service] checkJobSavedService result:", saved ? "saved" : "not saved");
        return Boolean(saved);
    } catch (error) {
        console.log("[service] checkJobSavedService error: ", error);
        throw error;
    }
}

export const checkJobReportedService = async (userId: string, jobId: string) => {
    try {
        console.log("[service] checkJobReportedService called — userId:", userId, "jobId:", jobId);
        const reported = await jobReportsCollection.findOne({ userId, jobId });
        console.log("[service] checkJobReportedService result:", reported ? "reported" : "not reported");
        return Boolean(reported);
    } catch (error) {
        console.log("[service] checkJobReportedService error: ", error);
        throw error;
    }
}
