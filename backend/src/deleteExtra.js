import mongoose from "mongoose";
import dotenv from "dotenv";
import { Company } from "./models/company.model.js";
import { Job } from "./models/job.model.js";
import connectDB from "./config/db.config.js";

dotenv.config();

const deleteExtraJobs = async () => {
    try {
        await connectDB();
        
        const company = await Company.findOne({ name: 'Devraj Pandit Corp' });
        if (company) {
            const result = await Job.deleteMany({ company: company._id });
            console.log(`Deleted ${result.deletedCount} jobs belonging to Devraj Pandit Corp`);
            
            await Company.deleteOne({ _id: company._id });
            console.log('Deleted Devraj Pandit Corp from companies');
        } else {
            console.log('Devraj Pandit Corp not found');
        }
        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}
deleteExtraJobs();
