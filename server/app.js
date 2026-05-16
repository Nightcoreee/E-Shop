import "./config/config.js";
import cors from "cors";
import express from "express";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import { createTables } from "./utils/create.Tables.js";
import { errorMiddleware } from "./middlewares/error.Middleware.js";
import authRoutes from "./router/auth.Routes.js";
import productRoutes from "./router/product.Routes.js";

const app = express();


app.use(cors({
    origin: [process.env.FRONTEND_URL, process.env.DASHBOARD_URL],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(fileUpload({
    tempFileDir:  "./uploads",
    useTempFiles: true,
    parseNonFileFields: true,
}));

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/product", productRoutes);

createTables();

app.use(errorMiddleware)

export default app;