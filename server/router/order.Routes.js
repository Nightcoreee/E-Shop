import express from "express";
import {
    placeNewOrder,
    fetchSingleOrder,
    fetchMyOrders,
    fetchAllOrders,
    updateOrderStatus,
    deleteOrder
} from "../controllers/order.Controller.js";
import { 
    isAuthenticated,
    authorizeRoles
} from "../middlewares/auth.Middleware.js";

const router = express.Router();

router.post("/", isAuthenticated, placeNewOrder);
router.get("/my", isAuthenticated, fetchMyOrders);
router.get("/admin/", isAuthenticated, authorizeRoles("Admin"), fetchAllOrders);
router.put("/admin/:orderId", isAuthenticated, authorizeRoles("Admin"), updateOrderStatus);
router.delete("/admin/:orderId", isAuthenticated, authorizeRoles("Admin"), deleteOrder);
router.get("/:orderId", isAuthenticated, fetchSingleOrder);
export default router;
