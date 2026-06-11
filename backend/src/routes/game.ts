import { Router } from "express";
import { recordGame, getGameHistory } from "../controllers/game";

const gameRouter = Router();

gameRouter.post("/create", recordGame);
gameRouter.get("/list", getGameHistory);

export default gameRouter;
