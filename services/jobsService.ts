import { client } from '../db/db';

const db = client.db('niyog_db');
const collection = db.collection('jobs');

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
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function parseSalary(salary: string): number | null {
    if (typeof salary !== 'string') {
        console.log("[service] parseSalary: non-string input:", typeof salary, JSON.stringify(salary));
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
                type: { $regex: `^${escapeRegex(filters.type)}$`, $options: 'i' },
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
        if (location === 'remote') {
            matchConditions.push({
                $or: [
                    { isRemote: true },
                    { location: { $regex: 'remote', $options: 'i' } },
                ],
            });
        } else if (location === 'on-site') {
            matchConditions.push({
                $or: [
                    { isRemote: false },
                    { location: { $not: { $regex: 'remote', $options: 'i' } } },
                ],
            });
        }

        if (filters.keyword) {
            matchConditions.push({
                title: { $regex: escapeRegex(filters.keyword), $options: 'i' },
            });
        }

        if (filters.place) {
            matchConditions.push({
                location: { $regex: escapeRegex(filters.place), $options: 'i' },
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
                            { $ifNull: ['$salaryMin', false] },
                            { $toDouble: '$salaryMin' },
                            {
                                $let: {
                                    vars: {
                                        m: {
                                            $regexFind: {
                                                input: { $toString: { $ifNull: ['$salary', ''] } },
                                                regex: '\\d+',
                                            },
                                        },
                                    },
                                    in: {
                                        $cond: [
                                            { $ne: ['$$m', null] },
                                            { $toDouble: '$$m.match' },
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
                totalCount: [{ $count: 'count' }],
            },
        });

        console.log("[service] running aggregation pipeline:", JSON.stringify(pipeline));

        const result = await collection.aggregate(pipeline).toArray();

        const jobs = result[0]?.data ?? [];
        const totalCount = result[0]?.totalCount?.[0]?.count ?? 0;
        const totalPages = Math.max(1, Math.ceil(totalCount / limit));

        console.log("[service] pagination — page:", page, "limit:", limit, "totalCount:", totalCount, "totalPages:", totalPages, "returned:", jobs.length);

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
}

export const getJobsByCompanyIdService = async (query: any) => {
    try {
        console.log("[service] getJobsByCompanyIdService called with query:", query);
        const result = await collection.find(query).toArray();
        console.log("[service] getJobsByCompanyIdService returned", result.length, "jobs");
        return result;
    } catch (error) {
        console.log("[service] getJobsByCompanyIdService error: ", error);
        throw error;
    }
}
