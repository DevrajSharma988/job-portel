import cron from 'node-cron';
import { deleteUnverifiedUsersOlderThan } from '../repositories/auth.repository.js';

/**
 * Removes unverified user accounts that were created more than 24 hours ago.
 * Scheduled to run every hour so cleanup is timely without hammering the DB.
 */
const purgeUnverifiedUsers = async () => {
  try {
    console.log('[CRON] Unverified users cleanup started.');
    await deleteUnverifiedUsersOlderThan(24);
  } catch (error) {
    console.error('[CRON] Error purging unverified users:', error.message);
  }
};

export const setupCronJobs = () => {
  // Run every hour at minute 0  →  "0 * * * *"
  cron.schedule('0 * * * *', purgeUnverifiedUsers, {
    timezone: 'UTC',
  });

  console.log('[CRON] Scheduled: purge unverified users every hour (24-hour window).');
};

export default setupCronJobs;