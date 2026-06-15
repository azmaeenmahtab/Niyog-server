import { client } from '../db/db';

export interface RegisterCompanyPayload {
  name: string;
  industry: string;
  website: string;
  location: string;
  employeeRange: string;
  description: string;
  logoUrl: string | null;
  recruiterId: string;
}

const RegisterCompanyServie = (payload: RegisterCompanyPayload) => {
    const db = client.db("niyog_db");
    const companyCollection = db.collection("companies");
    const company = {
        name: payload.name,
        industry: payload.industry,
        website: payload.website,
        location: payload.location,
        employeeRange: payload.employeeRange,
        description: payload.description,
        logoUrl: payload.logoUrl,
        recruiterId: payload.recruiterId,
    };
    const result = companyCollection.insertOne(company);
    return result;
};

const getCompanyService = async (recruiterId?: string): Promise<RegisterCompanyPayload | null> => {
    const db = client.db("niyog_db");
    const companyCollection = db.collection("companies");
    const query = recruiterId ? { recruiterId } : {};
    const company = await companyCollection.findOne(query);
    return company as RegisterCompanyPayload | null;
};


module.exports = {RegisterCompanyServie, getCompanyService};

export { getCompanyService };