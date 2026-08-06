import express from "express";
import {
  orderDetails,
  orderPlace,
  orderssListing,
  orderStatus,
} from "./orders.controller.js";
import { validate } from "../../middlewares/validation.js";
import {
  orderPlaceSchema,
  ordersDetailsSchema,
  UpdateOrderStatusSchema,
} from "./orders.validate.js";

const ordersRouter = express.Router();

ordersRouter.get("/:id", validate(ordersDetailsSchema), orderssListing);
ordersRouter.post("/place", validate(orderPlaceSchema), orderPlace);
ordersRouter.get("/details/:id", validate(ordersDetailsSchema), orderDetails);
ordersRouter.put("/:id", validate(UpdateOrderStatusSchema), orderStatus);

export default ordersRouter;
