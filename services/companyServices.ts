import { ObjectId } from 'mongodb';
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
    console.log("[getCompanyService] query:", JSON.stringify(query));
    const company = await companyCollection.findOne(query);
    console.log("[getCompanyService] match:", company);
    return company as RegisterCompanyPayload | null;
};


const getAllCompaniesService = async () => {
  const db = client.db("niyog_db");
  const companyCollection = db.collection("companies");
  const companies = await companyCollection.find({}).sort({ _id: -1 }).toArray();
  return companies;
};


const updateCompanyStatusService = async (
  companyId: string,
  status: "approved" | "declined"
) => {
  const db = client.db("niyog_db");
  const companyCollection = db.collection("companies");

  const result = await companyCollection.findOneAndUpdate(
    { _id: new ObjectId(companyId) },
    { $set: { status, updatedAt: new Date() } },
    { returnDocument: "after" }
  );

  return result;
};

const deleteCompanyService = async (companyId: string) => {
  const db = client.db("niyog_db");
  const companyCollection = db.collection("companies");

  const result = await companyCollection.findOneAndDelete({
    _id: new ObjectId(companyId),
  });

  return result;
};

module.exports = {RegisterCompanyServie, getCompanyService, getAllCompaniesService, updateCompanyStatusService, deleteCompanyService};

export { getCompanyService };