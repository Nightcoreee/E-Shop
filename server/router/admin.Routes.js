import express from "express";
import {
    getAllUsers,
    deleteUser,
    dashboardStats
} from "../controllers/admin.Controller.js";
import {
    isAuthenticated,
    authorizeRoles
} from "../middlewares/auth.Middleware.js";

const router = express.Router();

router.get("/users", isAuthenticated, authorizeRoles("Admin"), getAllUsers);
router.delete("/users/:id", isAuthenticated, authorizeRoles("Admin"), deleteUser);
router.get("/dashboard/stats", isAuthenticated, authorizeRoles("Admin"), dashboardStats);

export default router;