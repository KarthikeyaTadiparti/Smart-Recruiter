import "dotenv/config";
import cors from "cors";
import express from "express";
import cookieParser from "cookie-parser";
import {Chalk} from "chalk";

import { errorHandler, handle404Error } from "./middlewares/errorhandler.ts";
import authRoutes from "./routes/auth-routes.ts";
import companyRoutes from "./routes/company-routes.ts";
import jobRoutes from "./routes/job-routes.ts";
import interviewRoutes from "./routes/interview-routes.ts";
import feedbackRoutes from "./routes/applications-routes.ts";

import morganMiddleware from "./config/morgan.ts";
import db from "./config/db.ts";
import { connectRedis } from "./config/redis.ts";
import { users } from "./schema/users-schema.ts";

const app = express();
const APP_URL = process.env.APP_URL;
const PORT: number = Number(process.env.PORT) || 3000;
const HOST: string = '0.0.0.0';
const customChalk = new Chalk({ level: 3 });


/* -------------------- CORS -------------------- */
const corsOptions = {
  origin: [APP_URL as string],
  credentials: true,
};

/* -------------------- MIDDLEWARES -------------------- */
app.use(morganMiddleware);
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

/* -------------------- ROUTES -------------------- */
app.use("/auth", authRoutes);
app.use("/companies", companyRoutes);
app.use("/jobs", jobRoutes);
app.use("/interviews", interviewRoutes);
app.use("/applications", feedbackRoutes);

/* -------------------- TEST ROUTE -------------------- */
app.get("/test", async (req, res) => {
  try {
    const rows = await db.select().from(users);
    res.json(rows);
  } catch (err) {
    console.error("DB error:", err);
    res.status(500).json({ status: false, error: "database error" });
  }
});

/* -------------------- ERROR HANDLERS -------------------- */
app.use(handle404Error);
app.use(errorHandler);

/* -------------------- SERVER STARTUP -------------------- */
const startServer = async () => {
  try {
    //Connect Redis
    await connectRedis();

    //Start server
    app.listen(PORT, HOST, () => {
      console.log(`Server is listening on port ${PORT}`);
      console.log(`Frontend: ${customChalk.blue.underline("http://localhost:5173")}`);
      console.log(`Database: ${customChalk.blue.underline("http://local.drizzle.studio")}`);
      console.log(`Redis: ${customChalk.blue.underline("http://localhost:5540")}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error);
    process.exit(1);
  }
};

startServer();
