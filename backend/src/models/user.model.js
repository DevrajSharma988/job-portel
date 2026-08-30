import mongoose from "mongoose";

import { USER_ROLES } from "../constants/roles.constant.js";

const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password:{
        type:String,
        required:true,
    },
    role:{
        type:String,
        enum:[USER_ROLES.APPLICANT, USER_ROLES.RECRUITER],
        required:true
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    emailVerificationOTP: {
        type: String
    },
    emailVerificationOTPExpires: {
        type: Date
    },
    forgotPasswordOTP: {
        type: String
    },
    forgotPasswordOTPExpires: {
        type: Date
    },
    profile:{
        bio:{type:String},
        skills:[{type:String}],
        resume:{type:String}, // URL to resume file
        resumeOriginalName:{type:String},
        company:{type:mongoose.Schema.Types.ObjectId, ref:'Company'}, 
        profilePhoto:{
            type:String,
            default:""
        },
        savedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Job' }]
    },
},{timestamps:true});
export const User = mongoose.model('User', userSchema);