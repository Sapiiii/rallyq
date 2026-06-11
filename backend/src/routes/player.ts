import { Router } from "express";
import { registerPlayer, removePlayer } from "../controllers/player";
import { verifyHost } from "../middlewares/host-auth";


const playerRouter = Router();

playerRouter.post("/create", verifyHost, registerPlayer);
playerRouter.delete("/delete/:id", verifyHost, removePlayer)

export default playerRouter;
