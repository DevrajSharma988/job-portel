import fs from 'fs';
import path from 'path';

const SRC_DIR = path.resolve('src');

const replacements = {
  'applicantMiddleware.js': 'applicant.middleware.js',
  'authMiddleware.js': 'auth.middleware.js',
  'errorMiddleware.js': 'error.middleware.js',
  'recruiterMiddleware.js': 'recruiter.middleware.js',
  'mutler.js': 'multer.middleware.js',
  'r2Client.js': 'r2.config.js',
  'redis.js': 'redis.config.js',
  'resend.js': 'resend.config.js',
  'utils/cloudinary.js': 'config/cloudinary.config.js',
  '../utils/cloudinary.js': '../config/cloudinary.config.js',
  '../../utils/cloudinary.js': '../../config/cloudinary.config.js',
  'auth.services.js': 'auth.service.js',
  'otpService.js': 'otp.service.js',
  'sessionService.js': 'session.service.js',
  'tokenService.js': 'token.service.js',
  'applicationStatus.js': 'applicationStatus.constant.js',
  'roles.js': 'roles.constant.js',
  'statusCodes.js': 'statusCodes.constant.js',
  'ApiError.js': 'ApiError.util.js',
  'ApiResponse.js': 'ApiResponse.util.js',
  'asyncHandler.js': 'asyncHandler.util.js',
  'cronJobs.js': 'cronJobs.util.js',
  'datauri.js': 'datauri.util.js',
  'clearAuthCookies.js': 'clearAuthCookies.util.js',
  'cookieOptions.js': 'cookieOptions.util.js',
  'createOTP.js': 'createOTP.util.js',
  'generateOTP.js': 'generateOTP.util.js',
  'hashPassword.js': 'hashPassword.util.js',
  'hashToken.js': 'hashToken.util.js',
  'sendTokenResponse.js': 'sendTokenResponse.util.js',
  'validatePassword.js': 'validatePassword.util.js',
  'forgotPasswordOTPTemplate.js': 'forgotPasswordOTP.template.js',
  'verificationOTPTemplate.js': 'verificationOTP.template.js',
  'auth.repositories.js': 'auth.repository.js'
};

function processDirectory(directory) {
  const files = fs.readdirSync(directory);
  for (const file of files) {
    const fullPath = path.join(directory, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.js')) {
      let content = fs.readFileSync(fullPath, 'utf-8');
      let changed = false;
      
      for (const [oldName, newName] of Object.entries(replacements)) {
        // Regex to match imports. We need to be careful with paths.
        // We match quotes around the import path and ensure the oldName is at the end of the path
        const regex = new RegExp(`(['"\`])(.*?)${oldName}\\1`, 'g');
        const newContent = content.replace(regex, `$1$2${newName}$1`);
        if (newContent !== content) {
          content = newContent;
          changed = true;
        }
      }
      
      if (changed) {
        fs.writeFileSync(fullPath, content);
        console.log(`Updated imports in ${fullPath}`);
      }
    }
  }
}

processDirectory(SRC_DIR);
console.log('Done replacing imports!');
