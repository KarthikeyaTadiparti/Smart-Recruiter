import "dotenv/config";
import cors from "cors";
import express from "express";
import cookieParser from "cookie-parser";
import { errorHandler, handle404Error } from "./middlewares/errorhandler.ts";
import authRoutes from "./routes/authRoutes.ts";
import morganMiddleware from "./config/morganConfig.ts";
import db from "./config/db.ts";
import { users } from "./drizzle/schema.ts";

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
