import { ErrorHandler } from "../middlewares/errorMiddleware.js";
import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import database from "../database/db.js";
import bcrypt from "bcrypt";
import { sendToken } from "../utils/jwt.Token.js";
import { passwordValidator } from "../utils/passwordValidator.js";

// Run function middleware to catch any erorrs
export const register = catchAsyncError(async (req, res, next) => {
    const { email, name, password } = req.body;

    if (!email || !name || !password) {
        return next(new ErrorHandler("Please provide all required fields", 400));
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

export const login = catchAsyncError(async (req, res, next) => {});
export const getUser = catchAsyncError(async (req, res, next) => {});
export const logout = catchAsyncError(async (req, res, next) => {});