import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import authRoute from "./src/routes/auth.route.js";
import companyRoute from "./src/routes/company.route.js";
import jobRoute from "./src/routes/job.route.js";
import applicationRoute from "./src/routes/application.route.js";
import path from "path";
import connectDB from "./src/config/db.config.js";
dotenv.config();

const app = express();

const _dirname = path.resolve();
// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
const corsOptions = {
    origin: 'https://job-portel-1-42el.onrender.com',
    credentials: true
}

app.use(cors(corsOptions));

const PORT = process.env.PORT || 3000;


// api's
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/companies", companyRoute);
app.use("/api/v1/jobs", jobRoute);
app.use("/api/v1/applications", applicationRoute);


app.use(express.static(path.join(_dirname, "./frontend/dist")));

app.get('*', (_, res) => {
    res.sendFile(path.resolve(_dirname, "frontend", "dist", "index.html"));
});


app.listen(PORT, () => {
    connectDB();
    console.log(`Server running at port ${PORT}`);
})