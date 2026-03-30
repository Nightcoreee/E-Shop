import {config} from "dotenv";
import cors from "cors";
import express from "express";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";

const app = express();

config({ path: "./config/.env"});

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
}));

export default app;