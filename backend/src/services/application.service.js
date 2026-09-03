import ApiError from "../utils/ApiError.util.js";
import STATUS_CODES from "../constants/statusCodes.constant.js";
import * as applicationRepository from "../repositories/application.repository.js";
import { sendEmail } from "../utils/email.util.js";

export const applyJob = async (userId, jobId) => {
  const existingApplication = await applicationRepository.findApplicationByJobAndApplicant(jobId, userId);
  if (existingApplication) {
    throw new ApiError(STATUS_CODES.BAD_REQUEST, "You have already applied for this jobs");
  }

  const job = await applicationRepository.findJobById(jobId);
  if (!job) {
    throw new ApiError(STATUS_CODES.NOT_FOUND, "Job not found");
  }

  const newApplication = await applicationRepository.createApplication({
    job: jobId,
    applicant: userId,
  });

  job.applications.push(newApplication._id);
  await job.save();
};

export const getAppliedJobs = async (userId) => {
  const application = await applicationRepository.findApplicationsByApplicant(userId);
  return application || [];
};

export const getApplicants = async (jobId) => {
  const job = await applicationRepository.findJobWithApplicants(jobId);
  if (!job) {
    throw new ApiError(STATUS_CODES.NOT_FOUND, "Job not found.");
  }
  return job;
};

export const updateStatus = async (applicationId, status) => {
  const application = await applicationRepository.findApplicationById(applicationId);
  if (!application) {
    throw new ApiError(STATUS_CODES.NOT_FOUND, "Application not found.");
  }

  application.status = status.toLowerCase();
  await application.save();

  // Send email notification
  if (application.applicant && application.applicant.email) {
    const jobTitle = application.job?.title || "a job";
    const companyName = application.job?.company?.name || "";
    const isAccepted = status.toLowerCase() === 'accepted';
    
    const subject = `Update on your application for ${jobTitle} ${companyName ? `at ${companyName}` : ''}`;
    let message = "";
    
    if (isAccepted) {
        message = `Hello ${application.applicant.fullname},\n\nGreat news! We wanted to let you know that your application for the ${jobTitle} role at ${companyName} has been Accepted by the recruiter.\n\nThe company may be in touch with you shortly for the next steps.\n\nThank you for using CareerNest to find your next opportunity!\n\nBest regards,\nCareerNest Team`;
    } else {
        message = `Hello ${application.applicant.fullname},\n\nWe wanted to let you know that your application for the ${jobTitle} role at ${companyName} has been updated to Rejected by the recruiter.\n\nWhile this wasn't the outcome we hoped for, keep your head up! There are many other opportunities waiting for you on our platform.\n\nThank you for using CareerNest.\n\nBest regards,\nCareerNest Team`;
    }
    
    // Fire and forget email
    sendEmail({
        email: application.applicant.email,
        subject,
        message
    });
  }
};
