import express from "express";
import usersRouter from "./modules/users/users.routes.js";
import menuRouter from "./modules/menu/menu.routes.js";
import ordersRouter from "./modules/orders/orders.routes.js";

const router = express.Router();

// user
router.use("/user", usersRouter);
router.use("/menu", menuRouter);
router.use("/order", ordersRouter);

export default router;
