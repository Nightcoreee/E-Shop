import express from "express";
import {
    placeNewOrder,
} from "../controllers/order.Controller.js";

import { 
    isAuthenticated,
    authorizeRoles
} from "../middlewares/auth.Middleware.js";

const router = express.Router();

router.post("/new", isAuthenticated, placeNewOrder);
export default router;
