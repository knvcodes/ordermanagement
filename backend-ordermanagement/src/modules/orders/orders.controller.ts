import { Request, Response, NextFunction } from "express";
import * as OrdersService from "./orders.service.js";
import { handleResponse } from "utils/helpers";
import logger from "utils/logger";

export const orderssListing = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // handleResponse(res, "List of orders");
  } catch (error) {
    logger.error({
      message: "Error in ordersListing",
      error: error instanceof Error ? error.message : error,
      stack: error instanceof Error ? error.stack : undefined,
      route: req.originalUrl,
      method: req.method,
      body: req.body,
    });
    next(error);
  }
};
