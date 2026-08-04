import { Request, Response, NextFunction } from "express";
import * as MenuService from "./menu.service.js";
import { handleResponse } from "utils/helpers";
import logger from "utils/logger";

export const menusListing = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // handleResponse(res, "List of menu");
  } catch (error) {
    logger.error({
      message: "Error in menuListing",
      error: error instanceof Error ? error.message : error,
      stack: error instanceof Error ? error.stack : undefined,
      route: req.originalUrl,
      method: req.method,
      body: req.body,
    });
    next(error);
  }
};
