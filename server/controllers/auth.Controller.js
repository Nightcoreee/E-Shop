import { ErrorHandler } from "../middlewares/errorMiddleware.js";
import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import database from "../database/db.js";
import bcrypt from "bcrypt";
import { sendToken } from "../utils/jwt.Token.js";

export const register = catchAsyncError(async (req, res, next) => {
    const { email, name, password } = req.body;
    if (!email || !name || !password) {
        return next(new ErrorHandler("Please provide all required fields", 400));
    }

    const isAccountExist = await database
        .query("SELECT * FROM users WHERE email = $1", [email]);
    if (isAccountExist.rows.length > 0) {
        return next(new ErrorHandler("Email already exists", 400));
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await database.query(
        "INSERT INTO users (email, name, password) VALUES ($1, $2, $3) RETURNING *",
        [email, name, hashedPassword]
    );

    sendToken(user.rows[0], "User registered successfully", 201, res);
});

export const login = catchAsyncError(async (req, res, next) => {});
export const getUser = catchAsyncError(async (req, res, next) => {});
export const logout = catchAsyncError(async (req, res, next) => {});