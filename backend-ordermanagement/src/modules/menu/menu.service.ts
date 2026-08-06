import { Request } from "express";
import Menu from "./menu.model.js";

export const getMenu = async (req: Request) => {
  try {
    const { page = 1, limit = 10, search, category = "All" } = req.query;

    const offset = (Number(page) - 1) * Number(limit);

    let whereClause: Record<string, unknown> = {};

    if (search) {
      const escapedSearch = search as string;
      whereClause.name = { $regex: escapedSearch, $options: "i" };
    }

    if (category && category !== "All") {
      whereClause.category = category;
    }

    const data = await Menu.find(whereClause).skip(offset).limit(Number(limit));
    const total = await Menu.countDocuments(whereClause);
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
