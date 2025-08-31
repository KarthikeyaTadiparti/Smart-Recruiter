import "dotenv/config";
import cors from "cors";
import express from "express";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import { errorHandler, handle404Error } from "./middlewares/errorhandler.ts";
import authRoutes from "./routes/authRoutes.ts";

connectDB();

const app = express();
const { PORT, APP_URL } = process.env;

const corsOptions = {
    origin: [APP_URL as string],
    credentials: true,
};


app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/auth',authRoutes);

app.use(handle404Error)
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`server is listening on port ${PORT}`);
});
