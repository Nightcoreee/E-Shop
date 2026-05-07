import express from "express";
import { 
    register, 
    login, 
    getUser, 
    logout, 
    forgotPassword, 
    resetPassword, 
    // updatePassword, 
    // updateProfile 
} from "../controllers/auth.Controller.js";
import { isAuthenticated } from "../middlewares/auth.Middleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", isAuthenticated ,getUser);
router.get("/logout", isAuthenticated, logout);
router.post("/password/forgot", forgotPassword);
router.put("/password/reset/:token", resetPassword);
// router.put("/password/update", isAuthenticated, updatePassword);
// router.put("/profile/update", isAuthenticated, updateProfile);

export default router;