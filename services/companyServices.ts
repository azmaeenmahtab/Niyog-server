import { client } from '../db/db';

export interface RegisterCompanyPayload {
  name: string;
  industry: string;
  website: string;
  location: string;
  employeeRange: string;
  description: string;
  logoUrl: string | null;
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
    };
    const result = companyCollection.insertOne(company);
    return result;
};

const getAllCompaniesService = async (): Promise<RegisterCompanyPayload[]> => {
    const db = client.db("niyog_db");
    const companyCollection = db.collection("companies");
    const companies = await companyCollection.find({}).toArray();
    return companies as unknown as RegisterCompanyPayload[];
};


module.exports = {RegisterCompanyServie, getAllCompaniesService};

export { getAllCompaniesService };