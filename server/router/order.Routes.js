import express from "express";
import {
    placeNewOrder,
    fetchSingleOrder,
    fetchMyOrders,
    fetchAllOrders
} from "../controllers/order.Controller.js";
import { 
    isAuthenticated,
    authorizeRoles
} from "../middlewares/auth.Middleware.js";

const router = express.Router();

router.post("/new", isAuthenticated, placeNewOrder);
router.get("/single/:orderId", isAuthenticated, fetchSingleOrder);
router.get("/myorders", isAuthenticated, fetchMyOrders);

router.get("/admin/all", isAuthenticated, authorizeRoles("Admin"), fetchAllOrders);

export default router;
