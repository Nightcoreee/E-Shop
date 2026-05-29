import express from "express";
import {
    getAllUsers,
} from "../controllers/admin.Controller.js";
import {
    isAuthenticated,
    authorizeRoles
} from "../middlewares/auth.Middleware.js";

const router = express.Router();

router.get("/users", isAuthenticated, authorizeRoles("Admin"), getAllUsers);

export default router;