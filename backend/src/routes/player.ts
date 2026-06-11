import { Router } from "express";
import { registerPlayer, removePlayer } from "../controllers/player";


const playerRouter = Router();

playerRouter.post("/create", registerPlayer);
playerRouter.delete("/delete/:id", removePlayer)

export default playerRouter;
