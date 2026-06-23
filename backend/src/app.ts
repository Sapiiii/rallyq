import express from "express";
import cors from "cors";
import { config } from "./config/env";
import morgan from "morgan";
import mainRouter from "./routes/main";
import { errorHandler } from "./middlewares/error";

const app = express();

app.use(
  cors({
    origin: config.FRONTEND_URL,
    credentials: true,
  }),
);
app.use(morgan("tiny"));
app.use(express.json());

app.use("/api", mainRouter);

app.use(errorHandler);

export default app;
