import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import { ErrorHandler } from "../middlewares/error.Middleware.js";
import database from "../database/db.js";
import { v2 as cloudinary } from "cloudinary";

//GET /api/v1/admin/users
export const getAllUsers = catchAsyncError(async (req, res, next) => {
    const page = parseInt(req.query.page) || 1;

    const totalUsersResult = await database.query(`SELECT COUNT(*) FROM users WHERE role = $1`, ['User']);

    const totalUser = parseInt(totalUsersResult.rows[0].count);

    const offset = (page - 1) * 10;

    const users = await database.query(
        `SELECT * FROM users WHERE role = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3`,
        ['User', 10, offset]
    );
    res.status(200).json({
        success: true,
        totalUser,
        currentPage: page,
        users: users.rows
    });
});

