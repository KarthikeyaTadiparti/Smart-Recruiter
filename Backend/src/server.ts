import "dotenv/config";
import cors from "cors";
import express from "express";
import cookieParser from "cookie-parser";
import { errorHandler, handle404Error } from "./middlewares/errorhandler.ts";
import authRoutes from "./routes/auth-routes.ts";
import companyRoutes from "./routes/company-routes.ts";
import jobRoutes from "./routes/job-routes.ts";
import morganMiddleware from "./config/morgan.ts";
import db from "./config/db.ts";
import { users } from "./schema/users-schema.ts";
import interviewRoutes from "./routes/interview-routes.ts";

const app = express();
const { PORT, APP_URL } = process.env;

const corsOptions = {
    origin: [APP_URL as string],
    credentials: true,
};

app.use(morganMiddleware);
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/auth',authRoutes);
app.use('/companies',companyRoutes);
app.use('/jobs',jobRoutes);
app.use('/interviews',interviewRoutes);

app.get("/test", async (req, res) => {
  try {
    const rows = await db.select().from(users); 
    res.json(rows);
  } catch (err) {
    console.error("DB error:", err);
    res.status(500).json({ success: false, error: "database error" });
  }
});

app.use(handle404Error)
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`server is listening on port ${PORT}`);
});
