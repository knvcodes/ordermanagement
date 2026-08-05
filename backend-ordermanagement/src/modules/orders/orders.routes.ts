import express from "express";
import {
  orderDetails,
  orderPlace,
  orderssListing,
  orderStatus,
} from "./orders.controller.js";
import { validate } from "../../middlewares/validation.js";
import { UpdateOrderStatusSchema } from "./orders.validate.js";

const ordersRouter = express.Router();

ordersRouter.get("/:id", orderssListing);
ordersRouter.post("/place", orderPlace);
ordersRouter.get("/details/:id", orderDetails);
ordersRouter.put("/:id", validate(UpdateOrderStatusSchema), orderStatus);

export default ordersRouter;
