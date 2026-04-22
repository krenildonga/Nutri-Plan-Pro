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
    console.error(`\n[CONFIG WARNING] Missing environment variables: ${missingFields.join(', ')}`);
    console.error(`Please ensure these are set in the Vercel Dashboard or .env file.`);
    console.error(`The app will start, but features requiring these variables will fail.\n`);
}

module.exports = config;
