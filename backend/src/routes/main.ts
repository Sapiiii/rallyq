import { Router } from "express";

import gameRouter from "./game";
import playerRouter from "./player";
import sessionRouter from "./session";

const mainRouter = Router();

mainRouter.use("/games", gameRouter);
mainRouter.use("/players", playerRouter);
mainRouter.use("/sessions", sessionRouter);

export default mainRouter;
