// export const USER_API_END_POINT="https://job-portel-1-42el.onrender.com/api/v1/user";
// export const JOB_API_END_POINT="https://job-portel-1-42el.onrender.com/api/v1/job";
// export const APPLICATION_API_END_POINT="https://job-portel-1-42el.onrender.com/api/v1/application";
// export const COMPANY_API_END_POINT="https://job-portel-1-42el.onrender.com/api/v1/company";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api/v1";

export const USER_API_END_POINT=`${API_BASE_URL}/auth`;
export const JOB_API_END_POINT=`${API_BASE_URL}/jobs`;
export const APPLICATION_API_END_POINT=`${API_BASE_URL}/applications`;
export const COMPANY_API_END_POINT=`${API_BASE_URL}/companies`;

export const getDownloadUrl = (url, filename) => {
    if (!url) return '';
    if (url.includes('res.cloudinary.com')) {
        const parts = url.split('/upload/');
        if (parts.length === 2) {
            const encodedName = encodeURIComponent(filename || 'resume');
            return `${parts[0]}/upload/fl_attachment:${encodedName}/${parts[1]}`;
        }
    }
    return url;
};

export const formatSalary = (job) => {
    if (!job || job.salaryType === 'Not Disclosed') return 'Not Disclosed';

    const formatAmount = (amt) => {
        if (!amt) return '0';
        if (job.salaryPeriod === 'Yearly (LPA)') return `₹${amt}L`;
        return `₹${amt.toLocaleString('en-IN')}`;
    };

    const periodSuffix = job.salaryPeriod === 'Yearly (LPA)' ? ' LPA' : 
                         job.salaryPeriod === 'Monthly' ? ' / month' : ' / hr';

    if (job.salaryType === 'Fixed') {
        return `${formatAmount(job.salaryMin)}${periodSuffix}`;
    }
    
    if (job.salaryType === 'Range') {
        return `${formatAmount(job.salaryMin)} - ${formatAmount(job.salaryMax)}${periodSuffix}`;
    }

    return 'Not Disclosed';
};

export const formatExperience = (job) => {
    if (!job) return 'Fresher';
    if (job.experienceLevel && typeof job.experienceLevel === 'string') {
        return job.experienceLevel;
    }
    return 'Fresher (0 Years)';
};