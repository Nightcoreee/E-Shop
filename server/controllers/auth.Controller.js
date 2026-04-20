import { ErrorHandler } from "../middlewares/error.Middleware.js";
import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import database from "../database/db.js";
import bcrypt from "bcrypt";
import { sendToken } from "../utils/jwt.Token.js";
import { emailValidator, passwordValidator } from "../utils/user.Validator.js";

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


export const getUser = catchAsyncError(async (req, res, next) => {
    const { email, name } = req.body;

});


export const logout = catchAsyncError(async (req, res, next) => {});