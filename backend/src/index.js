import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectDB from "./config/db.config.js";
import authRoute from "./routes/auth.route.js";
import companyRoute from "./routes/company.route.js";
import jobRoute from "./routes/job.route.js";
import applicationRoute from "./routes/application.route.js";
import path from "path";
import { connectRedis } from './config/redis.config.js';

const app = express();

const _dirname=path.resolve();
// middleware
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
const corsOptions = {
    origin:['https://job-portel-1-42el.onrender.com', 'http://localhost:5173'],
    credentials:true
}

app.use(cors(corsOptions));

const PORT = process.env.PORT || 8000;


// api's
app.use("/api/v1/user", authRoute);
app.use("/api/v1/company", companyRoute);
app.use("/api/v1/job", jobRoute);
app.use("/api/v1/application", applicationRoute);


app.use(express.static(path.join(_dirname, "../frontend/dist")));

app.get('*', (_, res) => {
    res.sendFile(path.resolve(_dirname, "..", "frontend", "dist", "index.html"));
});

// Global Error Handler
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(statusCode).json({
        success: false,
        message: message,
        ...(err.code && { code: err.code }),
        ...(err.data && { data: err.data })
    });
});


app.listen(PORT, async () => {
    connectDB();
    await connectRedis();
    console.log(`Server running at port ${PORT}`);
})