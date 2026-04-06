import ErrorHandler from "./middlewares/errorMiddleware.js";
import { catchAsyncError } from "./middlewares/catchAsyncError.js";
import database from "./database/db.js";
import bcrypt from "bcryptjs";

export const register = catchAsyncError(async (req, res, next) => {
    const { email, name, password } = req.body;
    if (!email || !name || !password) {
        return next(new ErrorHandler(400, "Please provide all required fields"));
    }
    const isAccountExist = await database
        .query("SELECT * FROM users WHERE email = $1", [email]);
    if (isAccountExist.row.length > 0) {
        return next(new ErrorHandler(400, "Email already exists"));
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await database.query(
        "INSERT INTO users (email, name, password) VALUES ($1, $2, $3)",
        [email, name, hashedPassword]
    );
    res.status(201).json({
        success: true,
        message: "User registered successfully"
    });
});

export const login = catchAsyncError(async (req, res, next) => {});
export const getUser = catchAsyncError(async (req, res, next) => {});
export const logout = catchAsyncError(async (req, res, next) => {});