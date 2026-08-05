import { Request, Response, NextFunction } from "express";
import logger from "../../utils/logger.js";
import { handleResponse } from "../../utils/helpers.js";
import {
  getOrderDetails,
  getOrders,
  placeOrder,
  updateOrderStatus,
} from "./orders.service.js";

export const orderssListing = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const orders = await getOrders(req);
    handleResponse(res, "User's orders", orders);
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

export const orderPlace = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const order = await placeOrder(req);
    handleResponse(res, "Order placed succesfully", order);
  } catch (error) {
    logger.error({
      message: "Error in orderPlace",
      error: error instanceof Error ? error.message : error,
      stack: error instanceof Error ? error.stack : undefined,
      route: req.originalUrl,
      method: req.method,
      body: req.body,
    });
    next(error);
  }
};

export const orderDetails = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const order = await getOrderDetails(req);
    handleResponse(res, "Order details fetched successfully", order);
  } catch (error) {
    logger.error({
      message: "Error in orderDetails",
      error: error instanceof Error ? error.message : error,
      stack: error instanceof Error ? error.stack : undefined,
      route: req.originalUrl,
      method: req.method,
      body: req.body,
    });
    next(error);
  }
};

export const orderStatus = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const order = await updateOrderStatus(req);
    handleResponse(res, "Order status updated successfully", order);
  } catch (error) {
    logger.error({
      message: "Error in orderStatus",
      error: error instanceof Error ? error.message : error,
      stack: error instanceof Error ? error.stack : undefined,
      route: req.originalUrl,
      method: req.method,
      body: req.body,
    });
    next(error);
  }
};
