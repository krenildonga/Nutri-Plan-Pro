const path = require('path');

// Initial load of environment variables
// This handles both local and Vercel environments by checking relative to the file path
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const config = {
    env: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 8000,
    mongoUri: process.env.MONGO_URI,
    jwtSecret: process.env.SECRET_KEY,
    jwtExpire: process.env.EXPIRES_IN || '7d',
    cookieExpire: parseInt(process.env.COOKIE_EXPIRE) || 7,
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
    mailUser: process.env.MAIL_USER,
    passKey: process.env.PASS_KEY,
    isVercel: !!process.env.VERCEL
};

// Validation for critical variables
const requiredFields = ['jwtSecret', 'mongoUri'];
const missingFields = requiredFields.filter(field => !config[field]);

if (missingFields.length > 0) {
    console.error(`\n[FATAL CONFIG ERROR] Missing required environment variables: ${missingFields.join(', ')}`);
    console.error(`Make sure to set these in your .env file or Vercel Dashboard.\n`);
    
    // In production, we should throw to prevent insecure execution
    if (config.env === 'production' || config.isVercel) {
        throw new Error(`Missing required configuration: ${missingFields.join(', ')}`);
    }
}

module.exports = config;
