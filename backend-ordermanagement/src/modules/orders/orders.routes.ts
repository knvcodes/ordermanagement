import express from "express";
import { orderssListing } from "./orders.controller.js";

const ordersRouter = express.Router();

ordersRouter.get("/list", orderssListing);

export default ordersRouter;
