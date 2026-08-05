import { Request, Response, NextFunction } from "express";
import * as OrderItemsService from "./orderItems.service";
import { handleResponse } from "utils/helpers";
import logger from "utils/logger";

export const orderItemssListing = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // handleResponse(res, "List of orderItems");
  } catch (error) {
    logger.error({
      message: "Error in orderItemsListing",
      error: error instanceof Error ? error.message : error,
      stack: error instanceof Error ? error.stack : undefined,
      route: req.originalUrl,
      method: req.method,
      body: req.body,
    });
    next(error);

  }
};