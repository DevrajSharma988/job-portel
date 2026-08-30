import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    requirements: [{
        type: String
    }],
    salary: { // Keep for fallback, but not strictly required
        type: Number,
        default: 0
    },
    salaryType: {
        type: String,
        enum: ['Fixed', 'Range', 'Not Disclosed'],
        default: 'Not Disclosed'
    },
    salaryMin: {
        type: Number,
        default: 0
    },
    salaryMax: {
        type: Number,
        default: 0
    },
    salaryPeriod: {
        type: String,
        enum: ['Yearly (LPA)', 'Monthly', 'Hourly'],
        default: 'Yearly (LPA)'
    },
    experienceLevel:{
        type: String,
        required:true,
    },
    location: [{
        type: String,
        required: true
    }],
    employmentType: {
        type: String,
        enum: ['Permanent', 'Internship', 'Contract', 'Freelance'],
        default: 'Permanent'
    },
    workMode: {
        type: String,
        enum: ['Remote', 'On-site', 'Hybrid'],
        default: 'On-site'
    },
    jobType: {
        type: String,
        enum: ['Full-time', 'Part-time'],
        default: 'Full-time'
    },
    position: {
        type: Number,
        required: true
    },
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: true
    },
    created_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    applications: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Application',
        }
    ]
},{timestamps:true});
export const Job = mongoose.model("Job", jobSchema);