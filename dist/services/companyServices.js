"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCompanyService = void 0;
const db_1 = require("../db/db");
const RegisterCompanyServie = (payload) => {
    const db = db_1.client.db("niyog_db");
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
const getCompanyService = async (recruiterId) => {
    const db = db_1.client.db("niyog_db");
    const companyCollection = db.collection("companies");
    const query = recruiterId ? { recruiterId } : {};
    console.log("[getCompanyService] query:", JSON.stringify(query));
    const company = await companyCollection.findOne(query);
    console.log("[getCompanyService] match:", company);
    return company;
};
exports.getCompanyService = getCompanyService;
const getAllCompaniesService = async () => {
    const db = db_1.client.db("niyog_db");
    const companyCollection = db.collection("companies");
    const companies = await companyCollection.find({}).sort({ _id: -1 }).toArray();
    return companies;
};
module.exports = { RegisterCompanyServie, getCompanyService, getAllCompaniesService };
