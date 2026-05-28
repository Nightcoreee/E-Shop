import express from "express";
import {
    createProduct,
    fetchAllProducts,
    fetchSingleProduct,
    postProductReview,
    deleteReview,
} from "../controllers/product.Controller.js";
import { 
    isAuthenticated,
    authorizeRoles
} from "../middlewares/auth.Middleware.js";

const router = express.Router();

router.get("/", fetchAllProducts);
router.post("/admin/create", isAuthenticated, authorizeRoles("Admin"), createProduct);
router.put("/admin/update/:productId",isAuthenticated,authorizeRoles("Admin"),updateProduct);
router.get("/singleProduct/:productId", fetchSingleProduct);
router.put("/post-new/review/:productId", isAuthenticated, postProductReview);
router.delete("/delete/review/:productId", isAuthenticated, deleteReview);

export default router;