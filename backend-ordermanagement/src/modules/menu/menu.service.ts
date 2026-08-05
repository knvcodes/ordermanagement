import { Request } from "express";
import Menu from "./menu.model.js";

export const getMenu = async (req: Request) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const offset = (Number(page) - 1) * Number(limit);

    const data = await Menu.find().skip(offset).limit(Number(limit));

    const total = await Menu.countDocuments();

    const hasNext = total - (offset + Number(limit)) > 0;

    return {
      data,
      page,
      total,
      hasNext,
    };
  } catch (error: unknown) {
    throw error;
  }
};
