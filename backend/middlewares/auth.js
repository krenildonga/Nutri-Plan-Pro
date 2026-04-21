const jwt = require('jsonwebtoken');
const Register = require('../src/models/Register');

const auth = async function (req, res, next) {
    try {
        let token = null;

        // First try Authorization header (works on Vercel production)
        const authHeader = req.headers['authorization'];
        if (authHeader && authHeader.startsWith('Bearer ')) {
            token = authHeader.substring(7);
        }

        // Fallback to cookie (works in local development)
        if (!token && req.cookies && req.cookies.token) {
            token = req.cookies.token;
        }

        if (!token) throw new Error('No token found');

        const userVerify = jwt.verify(token, process.env.SECRET_KEY);
        const user = await Register.findOne({ _id: userVerify._id });

        if (!user) throw new Error('User not found');

        req.user = user;
        next();
    } catch (err) {
        res.status(401).json({ error: "Unauthorized access" });
    }
}

module.exports = auth;