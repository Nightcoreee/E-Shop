import express from "express";
import { 
    register, 
    login, 
    getUser, 
    logout, 
    forgotPassword, 
    resetPassword, 
    updatePassword, 
    updateProfile 
} from "../controllers/auth.Controller.js";
import { isAuthenticated } from "../middlewares/auth.Middleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", isAuthenticated, logout);
router.get("/me", isAuthenticated ,getUser);

//Password routes
router.post("/password/forgot", forgotPassword);
router.patch("/password/reset/:token", resetPassword);
router.patch("/password/update", isAuthenticated, updatePassword);

//Profile route
router.patch("/profile", isAuthenticated, updateProfile);

export default router;