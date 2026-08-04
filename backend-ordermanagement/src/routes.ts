import express from "express";
import usersRouter from "./modules/users/users.routes.js";

const router = express.Router();

// user
router.use("/user", usersRouter);

export default router;
