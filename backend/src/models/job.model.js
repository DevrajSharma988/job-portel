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
    salary: {
        type: Number,
        required: true
    },
    experienceLevel:{
        type:Number,
        required:true,
    },
    location: [{
        type: String,
        required: true
    }],
    employmentType: {
        type: String,
        enum: ['Permanent', 'Internship'],
        default: 'Permanent'
    },
    workMode: {
        type: String,
        enum: ['Full-time', 'Part-time', 'Remote', 'On-site', 'Hybrid'],
        default: 'Full-time'
    },
    jobType: {
        type: String,
        required: false
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