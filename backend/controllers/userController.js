const { validationResult } = require('express-validator');
const Register = require('../src/models/Register');
const DietHistory = require('../src/models/DietHistory')
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

const userRegister = async (req, res) => {
    try {
        // getting error through validationResult from req object
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const errorMessage = errors.array().map(err => err.msg).join('\n');
            return res.status(400).json({ success: false, error: errorMessage });
        }

        const { name, email, age, height, weight, gender, occupation, password, dietaryPreference } = req.body;

        // checking user is already exist or not 
        let user = await Register.findOne({ email });
        if (user) {
            return res.status(400).json({ success: false, error: "User with this email already exists" });
        }

        const registerUser = new Register({
            name,
            email,
            age,
            height,
            weight,
            gender,
            occupation,
            password,
            dietaryPreference
        });

        await registerUser.save();
        const token = await registerUser.generateToken();
        const maxAge = 3600 * 1000;
        const options = {
            httpOnly: true,
            maxAge: maxAge,
            sameSite: 'lax',
            secure: false // Set to true if using HTTPS
        };

        return res.status(201).cookie('token', token, options).json({
            success: true,
            message: "Registered successfully",
            userData: registerUser,
            auth_token: token
        });
    }
    catch (err) {
        console.error("Critical Registration Error:", err);
        console.error("Stack Trace:", err.stack);
        return res.status(500).json({ 
            success: false, 
            error: "Internal Server Error", 
            message: process.env.NODE_ENV === 'production' ? "Check server logs for details" : err.message 
        });
    }
}

// Helper function to send welcome email safely
const sendWelcomeEmail = async (name, email) => {
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.PASS_KEY
        }
    });

    const mailOptions = {
        from: process.env.MAIL_USER,
        to: email,
        subject: 'Welcome to NutriPlanPro!',
        html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 20px auto; background-color: #ffffff; padding: 20px; border-radius: 10px; box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);">
            <h1 style="color: #164043;">Welcome to NutriPlanPro, ${name}!</h1>
            <p>We are thrilled to welcome you aboard as a member of our platform dedicated to promoting healthy living through personalized diet recommendations.</p>
            <p>At NutriPlanPro, we empower you with personalized diet plans tailored to your specific requirements.</p>
            <p>Thank you for entrusting us with your health journey!</p>
            <p><strong>Best regards,<br>The NutriPlanPro Team</strong></p>
        </div>`
    };

    return transporter.sendMail(mailOptions);
}

const userLogin = async (req, res) => {
    try {
        const error = validationResult(req);
        if (!error.isEmpty()) {
            const errorMessage = error.array().map(err => err.msg).join('\n');
            return res.status(400).json({ success: false, error: errorMessage });
        }

        const { email, password } = req.body;
        const userData = await Register.findOne({ email }).select("+password");

        if (userData && (await bcrypt.compare(password, userData.password))) {
            const token = await userData.generateToken();
            const maxAge = 3600 * 1000;
            const options = {
                httpOnly: true,
                maxAge: maxAge,
                sameSite: 'lax',
                secure: false // Set to true if using HTTPS
            };
            return res.status(201).cookie('token', token, options).json({
                success: true,
                userData: userData,
                auth_token: token
            });
        } else {
            return res.status(401).json({ success: false, error: 'Invalid Email or Password' });
        }
    }
    catch (err) {
        console.error("Critical Login Error:", err);
        console.error("Stack Trace:", err.stack);
        return res.status(500).json({ 
            success: false, 
            error: "Internal Server Error",
            message: process.env.NODE_ENV === 'production' ? "Check server logs for details" : err.message
        });
    }
}

const editProfile = async (req, res) => {
    // getting error through validationResult from req object
    const error = validationResult(req);
    if (!error.isEmpty()) {
        const errorMessage = error.array().map(error => error.msg).join('\n');
        return res.status(400).json({ success: false, error: errorMessage })
    }

    const { name, age, height, weight, gender, occupation, dietaryPreference } = req.body;
    console.log(occupation);
    const userId = req.user._id

    // checking user is already exist or not 
    let user = await Register.findById(userId);

    try {
        if (!user) {
            return res.status(400).json({ error: "User not registered!" });
        }

        const updatedProfile = await Register.findByIdAndUpdate(userId, {
            name,
            age,
            height,
            weight,
            gender,
            occupation,
            dietaryPreference
        }, { new: true });
        console.log("Updated Successfully")
        res.status(201).json({ success: true, userData: updatedProfile });
    }
    catch (err) {
        console.log(err.message);

        // throwing error with status code 500 (Internal Server Error)
        res.status(500).json({ error: err.message });
    }
}

const saveDiet = async (req, res) => {
    const { personalData, selectedMeals } = req.body;

    try {
        const history = new DietHistory({
            userId: req.user._id,
            personalData,
            selectedMeals
        });

        await history.save();
        console.log(`[AUTO-SAVE SUCCESS] Diet plan saved for user ${req.user._id}. Meals: ${history.selectedMeals.length}, Calories: ${history.personalData.required_calories}`);
        res.status(201).json({ success: true });
    }
    catch (err) {
        console.log(err.message);

        // throwing error with status code 500 (Internal Server Error)
        res.status(500).json({ error: err.message });
    }
}

const getHistory = async (req, res) => {
    try {
        console.log(`[GET-HISTORY] Fetching records for user: ${req.user._id}`);
        // Only return records that have personalData to avoid rendering crashes
        const history = await DietHistory.find({
            userId: req.user._id,
            personalData: { $exists: true }
        }).sort({ createdAt: -1 });
        console.log(`[GET-HISTORY] Found ${history.length} valid records.`);
        res.status(200).json({ success: true, history });
    }
    catch (err) {
        console.log(err.message);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
}

const deleteHistory = async (req, res) => {
    try {
        const historyId = req.params.id;
        const deletedRecord = await DietHistory.findOneAndDelete({ _id: historyId, userId: req.user._id });

        if (!deletedRecord) {
            return res.status(404).json({ success: false, error: "Record not found or unauthorized" });
        }

        console.log("Record deleted successfully:", historyId);
        res.status(201).json({ success: true, message: "Record deleted successfully" });
    }
    catch (err) {
        console.error("Delete Error:", err.message);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
}


const userLogout = (req, res) => {
    res.cookie('token', '', {
        httpOnly: true,
        expires: new Date(Date.now())
    })
    console.log("Logout successfully")
    res.status(201).json({ success: true });
}

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await Register.findOne({ email });

        if (!user) {
            return res.status(404).json({ success: false, error: "User not found with this email" });
        }

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Hash and set reset token (OTP) & expiry
        user.resetPasswordToken = crypto
            .createHash('sha256')
            .update(otp)
            .digest('hex');
        user.resetPasswordExpires = Date.now() + 600000; // 10 minutes

        await user.save({ validateBeforeSave: false });

        const message = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 20px auto; background-color: #ffffff; padding: 20px; border-radius: 10px; box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);">
            <h1 style="color: #164043;">Password Reset OTP</h1>
            <p>You are receiving this email because you (or someone else) have requested the reset of a password for your account.</p>
            <p>Your 6-digit verification code is:</p>
            <div style="font-size: 32px; font-weight: bold; color: #164043; letter-spacing: 5px; margin: 20px 0; text-align: center; background: #f0fdf4; padding: 20px; border-radius: 10px; border: 2px dashed #164043;">
                ${otp}
            </div>
            <p>This code will expire in 10 minutes.</p>
            <p>If you did not request this, please ignore this email.</p>
            <p><strong>Best regards,<br>The NutriPlanPro Team</strong></p>
        </div>`;

        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.PASS_KEY
            }
        });

        const mailOptions = {
            from: process.env.MAIL_USER,
            to: user.email,
            subject: 'NutriPlanPro - Password Reset OTP',
            html: message
        };

        try {
            await transporter.sendMail(mailOptions);
            res.status(200).json({ success: true, message: 'OTP sent to your email' });
        } catch (mailError) {
            console.error("Mail Service Error:", mailError.message);

            // Fallback for development: Log the OTP to the console if email fails
            console.log("\n" + "=".repeat(50));
            console.log("DEVELOPMENT MODE: PASSWORD RESET OTP");
            console.log(`To: ${user.email}`);
            console.log(`OTP: ${otp}`);
            console.log("=".repeat(50) + "\n");

            res.status(200).json({
                success: true,
                message: 'OTP generated! (Check server console for the code as email service is not configured)'
            });
        }
    } catch (err) {
        console.error("Forgot Password Error:", err.message);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
}

const verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;

        const resetPasswordToken = crypto
            .createHash('sha256')
            .update(otp)
            .digest('hex');

        const user = await Register.findOne({
            email,
            resetPasswordToken,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ success: false, error: "Invalid or expired OTP" });
        }

        res.status(200).json({ success: true, message: "OTP verified successfully" });
    } catch (err) {
        console.error("Verify OTP Error:", err.message);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
}

const resetPassword = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await Register.findOne({ email });

        if (!user) {
            return res.status(404).json({ success: false, error: "User not found" });
        }

        // Set new password
        user.password = password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        await user.save();

        res.status(201).json({ success: true, message: "Password updated successfully" });
    } catch (err) {
        console.error("Reset Password Error:", err.message);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
}

module.exports = { userLogin, userRegister, userLogout, editProfile, saveDiet, getHistory, deleteHistory, forgotPassword, verifyOTP, resetPassword };
