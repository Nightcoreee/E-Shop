import express from "express";
import {
    createProduct,
    fetchAllProducts,
    fetchSingleProduct,
    upsertProductReview,
    deleteReview,
    updateProduct,
    deleteProduct,
    fetchAIFilteredProducts
} from "../controllers/product.Controller.js";
import { 
    isAuthenticated,
    authorizeRoles
} from "../middlewares/auth.Middleware.js";

const router = express.Router();

//Admin routes
router.post("/admin/", isAuthenticated, authorizeRoles("Admin"), createProduct);
router.put("/admin/:productId",isAuthenticated,authorizeRoles("Admin"),updateProduct);
router.delete("/admin/:productId",isAuthenticated,authorizeRoles("Admin"),deleteProduct);

// Public routes
router.get("/", fetchAllProducts);
router.get("/:productId", fetchSingleProduct);
router.post("/ai-search", isAuthenticated, fetchAIFilteredProducts);

router.put("/:productId/reviews", isAuthenticated, upsertProductReview);
router.delete("/:productId/reviews", isAuthenticated, deleteReview);

export default router;