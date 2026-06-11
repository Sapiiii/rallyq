import { Router } from "express";
import { startSession } from "../controllers/session";
import { endSession } from "../controllers/session";

const sessionRouter = Router();

sessionRouter.post("/create", startSession);
sessionRouter.delete("/delete/:id", endSession);

export default sessionRouter;
