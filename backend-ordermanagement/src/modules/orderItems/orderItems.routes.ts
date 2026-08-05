import express from "express";
import { orderItemssListing } from "./orderItems.controller";

const orderItemsRouter = express.Router();

orderItemsRouter.get("/list", orderItemssListing);

export default orderItemsRouter;