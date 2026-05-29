import express from "express";
import {
    getAllUsers,
    deleteUser
} from "../controllers/admin.Controller.js";
import {
    isAuthenticated,
    authorizeRoles
} from "../middlewares/auth.Middleware.js";

const router = express.Router();

router.get("/users", isAuthenticated, authorizeRoles("Admin"), getAllUsers);
router.delete("/users/:id", isAuthenticated, authorizeRoles("Admin"), deleteUser);

export default router;