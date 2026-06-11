import { Router } from "express";
import { recordGame, getGameHistory } from "../controllers/game";
import { verifyHost } from "../middlewares/host-auth";

const gameRouter = Router();

gameRouter.post("/create", verifyHost, recordGame);
gameRouter.get("/list", getGameHistory);

export default gameRouter;
