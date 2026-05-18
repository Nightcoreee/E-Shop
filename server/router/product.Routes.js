import express from "express";
import {
    createProduct,
} from "../controllers/product.Controller.js";
import { 
    isAuthenticated,
    authorizeRoles
} from "../middlewares/auth.Middleware.js";

const router = express.Router();

router.post("/admin/create", isAuthenticated, authorizeRoles("Admin"), createProduct);
router.get("/", fectchAllProducts);

export default router;