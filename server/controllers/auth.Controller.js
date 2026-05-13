import { ErrorHandler } from "../middlewares/error.Middleware.js";
import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import database from "../database/db.js";
import bcrypt from "bcrypt";
import { sendToken } from "../utils/jwt.Token.js";
import { emailValidator, passwordValidator } from "../utils/user.Validator.js";
import { genResetPasswordToken } from "../utils/ResetPassword.Token.js";
import { genForgotPasswordEmailTemplate } from "../utils/ForgotPasswordEmail.Template.js";
import { sendEmail } from "../utils/sendEmail.js";
import crypto from "crypto";
import { v2 as cloudinary } from "cloudinary";


// Run function middleware to catch any erorrs
//POST /api/auth/register
export const register = catchAsyncError(async (req, res, next) => {
    const { email, name, password } = req.body;

    if (!email || !name || !password) {
        return next(new ErrorHandler("Please provide all required fields", 400));
    }

    //Check valid email
    const emailError = emailValidator(email);
    if (emailError) {
        return next(new ErrorHandler(emailError, 400));
    }

    //Check valid password
    const passwordError = passwordValidator(password);
    if (passwordError) {
        return next(new ErrorHandler(passwordError, 400));
    }

    // Check if the email already exists in the database
    const isAccountExist = await database
        .query("SELECT 1 FROM users WHERE email = $1", [email]);
    if (isAccountExist.rows.length > 0) {
        return next(new ErrorHandler("Email already exists", 400));
    }

    //Hash password 
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await database.query(
        "INSERT INTO users (email, name, password) VALUES ($1, $2, $3) RETURNING *",
        [email, name, hashedPassword]
    );

    // Send token to server to alert user that they have successfully registered
    sendToken(user.rows[0], "User registered successfully", 201, res);
});

//POST /api/auth/login
export const login = catchAsyncError(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(new ErrorHandler("Please provide all required fields", 400));
    }

    const emailError = emailValidator(email);
    if (emailError) {
        return next(new ErrorHandler(emailError, 400));
    }

    const user = await database.query("SELECT * FROM users WHERE email = $1", [email]);
    if (user.rows.length === 0) {
        return next(new ErrorHandler("Invalid email or password", 401));
    }

    const isPasswordMatch = await bcrypt.compare(password, user.rows[0].password);
    if (!isPasswordMatch) {
        return next(new ErrorHandler("Invalid password", 401));
    }

    sendToken(user.rows[0], "Logged in successfully", 200, res);

});

//GET /api/auth/me
export const getUser = catchAsyncError(async (req, res, next) => {
    const { user } = req;
    res.status(200).json({
        sucess: true,
        user,
    });
});

//GET /api/auth/logout
export const logout = catchAsyncError(async (req, res, next) => {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
    });
    res.status(200).json({
        success: true,
        message: "Logged out successfully"
    });

});

//POST /api/auth/forgot-password
export const forgotPassword = catchAsyncError(async (req, res, next) => {
    const { email } = req.body;
    const { frontendUrl } = req.body;

    let userResult = await database.query("SELECT * FROM users WHERE email = $1", [email]);
    
    if(userResult.rows.length === 0) {
        return next(new ErrorHandler("User not found with this email", 404));
    }

    const user = userResult.rows[0];
    const { hashedToken, resetPasswordExpireTime, resetToken } = genResetPasswordToken();

    await database.query(
        "UPDATE users SET reset_password_token = $1, reset_password_expires = to_timestamp($2) WHERE id = $3",
        [hashedToken, resetPasswordExpireTime / 1000, user.id] 
    );

    const resetPasswordUrl = `${frontendUrl}/password/reset/${resetToken}`;

    const message = genForgotPasswordEmailTemplate(resetPasswordUrl);

    try {
        await sendEmail({
            email: user.email,
            subject: "Ecommerce Password Recovery",
            message,
        });
        res.status(200).json({
            success: true,
            message: `Email sent to ${user.email} successfully`,
        });
    } catch (error) {
        await database.query(
            "UPDATE users SET reset_password_token = NULL, reset_password_expires = NULL WHERE id = $1", [user.id]
        );
        return next(new ErrorHandler("Failed to send email", 500));
    }
});

//PUT /api/auth/password/reset/:token
export const resetPassword = catchAsyncError(async (req, res, next) => {
    const { token } = req.params;
    const { password, confirmPassword } = req.body;
    const resetPasswordToken = crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");
    
        const user = await database.query(
        "SELECT * FROM users WHERE reset_password_token = $1 AND reset_password_expires > NOW()",
        [resetPasswordToken]
    );

    if (user.rows.length === 0) {
        return next(new ErrorHandler("Invalid or expired reset token", 400));
    }

    if (!password || !confirmPassword) {
        return next(new ErrorHandler("Please provide all required fields", 400));
    }

    const passwordError = passwordValidator(req.body.password);
    if (passwordError) {
        return next(new ErrorHandler(passwordError, 400));
    }

    if(req.body.password !== req.body.confirmPassword) {
        return next(new ErrorHandler("Password and confirm password do not match", 400));
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const updatedUser = await database.query(
        `UPDATE users SET password = $1, reset_password_token = NULL, reset_password_expires = NULL WHERE id = $2 RETURNING *`,
        [hashedPassword, user.rows[0].id]
    );

    sendToken(updatedUser.rows[0], "Password reset successfully", 200, res);
});


export const updatePassword = catchAsyncError(async (req, res, next) => {
    const { currentPassword, newPassword, confirmPassword} = req.body;
    
    if(!currentPassword || !newPassword || !confirmPassword) {
        return next(new ErrorHandler("Please provide all required fields", 400));
    }

    const isPasswordMatch = await bcrypt.compare(currentPassword, req.user.password);
    if(!isPasswordMatch) {
        return next(new ErrorHandler("Current password is incorrect", 401));
    }

    if(newPassword !== confirmPassword) {
        return next(new ErrorHandler("New password and confirm password do not match", 400));
    }

    const passwordError = passwordValidator(newPassword);
    if (passwordError) {
        return next(new ErrorHandler(passwordError, 400));
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await database.query(`UPDATE users SET password = $1 where id = $2`, [hashedPassword, req.user.id]);

    res.status(200).json({
        success: true,
        message: "Password updated successfully"
    });
});