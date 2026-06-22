import { Router } from "express";
import { startSession, endSession } from "../controllers/session";
import { verifyHost } from "../middlewares/host-auth";

const sessionRouter = Router();

sessionRouter.post("/create", startSession);
sessionRouter.delete("/delete/:code", verifyHost, endSession);

export default sessionRouter;
