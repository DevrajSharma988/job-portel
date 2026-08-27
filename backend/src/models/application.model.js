import mongoose from "mongoose";
import { APPLICATION_STATUS } from "../constants/applicationStatus.constant.js";

const applicationSchema = new mongoose.Schema({
    job:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Job',
        required:true
    },
    applicant:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    status:{
        type:String,
        enum:[APPLICATION_STATUS.PENDING, APPLICATION_STATUS.ACCEPTED, APPLICATION_STATUS.REJECTED],
        default:APPLICATION_STATUS.PENDING
    }
},{timestamps:true});
export const Application  = mongoose.model("Application", applicationSchema);