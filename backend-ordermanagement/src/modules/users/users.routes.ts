import express from "express";
import { userProfile } from "./users.controller.js";
import { auth } from "../../middlewares/auth.middleware.js";
import { ALL_ROLES } from "../../config/roles.js";

const usersRouter = express.Router();

usersRouter.get("/profile", auth(ALL_ROLES), userProfile);

export default usersRouter;
