import express from "express";
import { orderPlace, orderssListing } from "./orders.controller.js";

const ordersRouter = express.Router();

ordersRouter.get("/:id", orderssListing);
ordersRouter.post("/place", orderPlace);

export default ordersRouter;
