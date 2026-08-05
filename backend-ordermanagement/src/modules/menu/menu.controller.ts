import { Request, Response, NextFunction } from "express";
import { handleResponse } from "../../utils/helpers.js";
import logger from "../../utils/logger.js";
import { getMenu } from "./menu.service.js";

export const menusListing = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = await getMenu(req);
    handleResponse(res, "List of menu", data);
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
