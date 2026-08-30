import mongoose from "mongoose";
import dotenv from "dotenv";
import { Company } from "./models/company.model.js";
import { Job } from "./models/job.model.js";
import { Application } from "./models/application.model.js";

dotenv.config({ path: "../.env" });

const clearDatabase = async () => {
    try {
        console.log("Connecting to MongoDB...");
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB.");

        console.log("Deleting all jobs...");
        const jobResult = await Job.deleteMany({});
        console.log(`Deleted ${jobResult.deletedCount} jobs.`);

        console.log("Deleting all companies...");
        const companyResult = await Company.deleteMany({});
        console.log(`Deleted ${companyResult.deletedCount} companies.`);
        
        console.log("Deleting all applications...");
        const appResult = await Application.deleteMany({});
        console.log(`Deleted ${appResult.deletedCount} applications.`);

        console.log("Successfully cleared jobs, companies, and applications. Users remain intact!");
    } catch (error) {
        console.error("Error clearing database:", error);
    } finally {
        mongoose.connection.close();
        console.log("Database connection closed.");
    }
};

clearDatabase();
