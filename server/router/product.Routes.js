import express from "express";
import {
    createProduct,
} from "../controllers/product.Controller.js";
import { 
    isAuthenticated,
    authorizeRoles
} from "../middlewares/auth.Middleware.js";

const router = express.Router();

router.post("/admin/create", isAuthenticated, authorizeRoles("admin"), createProduct);

export default router;