import mongoose from "mongoose";
import dotenv from "dotenv";
import { User } from "./models/user.model.js";
import { Company } from "./models/company.model.js";
import { Job } from "./models/job.model.js";
import { USER_ROLES } from "./constants/roles.constant.js";
import connectDB from "./config/db.config.js";

dotenv.config();

const jobTitles = ["Frontend Engineer", "Backend Developer", "Full Stack Engineer", "Data Scientist", "Product Manager", "DevOps Engineer", "UI/UX Designer", "Machine Learning Engineer", "Marketing Manager", "Sales Executive"];
const experienceLevels = ["Fresher (0 Years)", "1 - 2 Years", "2 - 5 Years", "5 - 10 Years", "10+ Years"];
const salaryTypes = ['Fixed', 'Range', 'Not Disclosed'];
const employmentTypes = ['Permanent', 'Internship', 'Contract', 'Freelance'];
const workModes = ['Remote', 'On-site', 'Hybrid'];
const jobTypes = ['Full-time', 'Part-time'];
const locationsList = ["Bangalore", "Pune", "Mumbai", "Hyderabad", "Delhi NCR", "Remote"];

const generateRandomJobs = (companyId, recruiterId, count) => {
    const jobs = [];
    for (let i = 0; i < count; i++) {
        const salaryType = salaryTypes[Math.floor(Math.random() * salaryTypes.length)];
        const salaryPeriod = "Yearly (LPA)";
        let salaryMin = 0;
        let salaryMax = 0;

        if (salaryType === 'Fixed') {
            salaryMin = Math.floor(Math.random() * 20) + 3;
        } else if (salaryType === 'Range') {
            salaryMin = Math.floor(Math.random() * 15) + 3;
            salaryMax = salaryMin + Math.floor(Math.random() * 10) + 2;
        }

        jobs.push({
            title: jobTitles[Math.floor(Math.random() * jobTitles.length)],
            description: "This is a great opportunity to work with cutting edge technologies. We are looking for passionate individuals who love solving complex problems and contributing to a highly scalable product.",
            requirements: ["React", "Node.js", "MongoDB", "Express", "TypeScript"],
            salaryType,
            salaryMin,
            salaryMax,
            salaryPeriod,
            experienceLevel: experienceLevels[Math.floor(Math.random() * experienceLevels.length)],
            location: [locationsList[Math.floor(Math.random() * locationsList.length)]],
            employmentType: employmentTypes[Math.floor(Math.random() * employmentTypes.length)],
            workMode: workModes[Math.floor(Math.random() * workModes.length)],
            jobType: jobTypes[Math.floor(Math.random() * jobTypes.length)],
            position: Math.floor(Math.random() * 5) + 1,
            company: companyId,
            created_by: recruiterId
        });
    }
    return jobs;
}

const seedDatabase = async () => {
    try {
        await connectDB();
        console.log("Connected to MongoDB.");

        // Clean up previous mock data
        await Job.deleteMany({});
        console.log("Deleted all existing jobs from the database.");

        const recruiters = await User.find({ role: USER_ROLES.RECRUITER });
        console.log(`Found ${recruiters.length} recruiters in the backend.`);

        let totalJobsCreated = 0;

        for (const recruiter of recruiters) {
            let company = await Company.findOne({ userId: recruiter._id });
            
            // Just in case they don't have a company, skip or create dummy
            if (!company) {
                console.log(`Recruiter ${recruiter.fullname} does not have a company. Creating a generic one...`);
                company = await Company.create({
                    name: `${recruiter.fullname} Corp`,
                    description: `This is a company for ${recruiter.fullname}`,
                    website: `https://${recruiter.fullname.replace(/\s+/g, '').toLowerCase()}corp.com`,
                    location: "Global",
                    userId: recruiter._id
                });
            }

            const jobsToCreate = generateRandomJobs(company._id, recruiter._id, 10);
            await Job.insertMany(jobsToCreate);
            totalJobsCreated += jobsToCreate.length;
            
            console.log(`-> Created 10 dynamic jobs for Recruiter: ${recruiter.fullname} | Company: ${company.name}`);
        }

        console.log(`\nSuccess! Seeded a total of ${totalJobsCreated} jobs across ${recruiters.length} recruiters.`);
        process.exit(0);
    } catch (error) {
        console.error("Error seeding database:", error);
        process.exit(1);
    }
}

seedDatabase();
