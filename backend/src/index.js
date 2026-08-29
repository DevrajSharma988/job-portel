import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRoute from "./routes/auth.route.js";
import companyRoute from "./routes/company.route.js";
import jobRoute from "./routes/job.route.js";
import applicationRoute from "./routes/application.route.js";
import path from "path";
import connectDB from "./config/db.config.js";
import {connectRedis} from "./config/redis.config.js";


const app = express();

const _dirname = path.resolve();
// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
const corsOptions = {
    origin: [
       process.env.FRONTEND_URL
    ],
    credentials: true
}

app.use(cors(corsOptions));

const PORT = process.env.PORT || 3000;


// api's
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/companies", companyRoute);
app.use("/api/v1/jobs", jobRoute);
app.use("/api/v1/applications", applicationRoute);


import errorMiddleware from "./middlewares/error.middleware.js";

app.use(express.static(path.join(_dirname, "./frontend/dist")));

app.get('*', (_, res) => {
    res.sendFile(path.resolve(_dirname, "frontend", "dist", "index.html"));
});

// Global error handler MUST be the last middleware
app.use(errorMiddleware);


app.listen(PORT, async () => {
    await connectDB();
    await connectRedis();
    console.log(`Server running at port ${PORT}`);
})