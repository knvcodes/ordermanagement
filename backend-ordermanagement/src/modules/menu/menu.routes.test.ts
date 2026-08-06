import express from "express";
import request from "supertest";
import { beforeEach, describe, expect, it, vi } from "vitest";
import menuRouter from "./menu.routes.js";
import { getMenu } from "./menu.service.js";
import { globalErrorHandler } from "../../utils/errors.js";
import { handleResponse } from "../../utils/helpers.js";

vi.mock("./menu.service.js", () => ({
  getMenu: vi.fn(),
}));

vi.mock("../../utils/helpers.js", () => ({
  handleResponse: vi.fn(),
}));

vi.mock("../../utils/logger.js", () => ({
  default: {
    info: vi.fn(),
    error: vi.fn(),
    warn: vi.fn(),
    debug: vi.fn(),
    fatal: vi.fn(),
    trace: vi.fn(),
    silent: vi.fn(),
  },
}));

const mockedGetMenu = vi.mocked(getMenu);
const mockedHandleResponse = vi.mocked(handleResponse);

const createTestApp = () => {
  const app = express();

  app.use(express.json());
  app.use("/api/menu", menuRouter);
  app.use(globalErrorHandler);

  return app;
};

describe("GET /api/menu/list", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // This mock mirrors your real handleResponse implementation.
    mockedHandleResponse.mockImplementation(((
      res: any,
      message: string,
      data: unknown,
    ) => {
      return res.status(200).json({
        message,
        data: data ?? null,
      });
    }) as any);
  });

  it("should return menu list successfully", async () => {
    const mockResult = {
      data: [
        {
          _id: "507f1f77bcf86cd799439011",
          name: "Margherita Pizza",
          description: "Classic pizza",
          price: 12.5,
          image: "/images/pizza.jpg",
          category: "Pizza",
          isAvailable: true,
        },
      ],
      page: "1",
      total: 1,
      hasNext: false,
    };

    mockedGetMenu.mockResolvedValueOnce(mockResult as any);

    const response = await request(createTestApp())
      .get("/api/menu/list")
      .query({
        category: "All",
      });

    expect(response.status).toBe(200);

    expect(response.body).toEqual({
      message: "Menu fetched successfully",
      data: mockResult,
    });

    expect(mockedGetMenu).toHaveBeenCalledTimes(1);

    expect(mockedHandleResponse).toHaveBeenCalledWith(
      expect.anything(),
      "Menu fetched successfully",
      mockResult,
    );
  });

  it("should pass query parameters to the service", async () => {
    mockedGetMenu.mockImplementationOnce(async (req: any) => {
      return {
        data: [],
        page: req.query.page ?? "1",
        total: 0,
        hasNext: false,
      } as any;
    });

    const response = await request(createTestApp())
      .get("/api/menu/list")
      .query({
        category: "Pizza",
        search: "pepper",
        page: "2",
        limit: "5",
      });

    expect(response.status).toBe(200);

    expect(mockedGetMenu).toHaveBeenCalledWith(
      expect.objectContaining({
        query: expect.objectContaining({
          category: "Pizza",
          search: "pepper",
          page: "2",
          limit: "5",
        }),
      }),
    );
  });

  it("should return empty data when service returns empty data", async () => {
    const mockResult = {
      data: [],
      page: "1",
      total: 0,
      hasNext: false,
    };

    mockedGetMenu.mockResolvedValueOnce(mockResult as any);

    const response = await request(createTestApp())
      .get("/api/menu/list")
      .query({
        category: "All",
      });

    expect(response.status).toBe(200);

    expect(response.body).toEqual({
      message: "Menu fetched successfully",
      data: mockResult,
    });
  });

  it("should return 400 when category is missing", async () => {
    const response = await request(createTestApp()).get("/api/menu/list");

    expect(response.status).toBe(400);

    expect(response.body.success).toBe(false);
    expect(response.body.error).toBe("Validation failed");

    expect(response.body.details).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          field: "query.category",
        }),
      ]),
    );

    expect(mockedGetMenu).not.toHaveBeenCalled();
  });

  it("should return 400 when category is invalid", async () => {
    const response = await request(createTestApp())
      .get("/api/menu/list")
      .query({
        category: "InvalidCategory",
      });

    expect(response.status).toBe(400);

    expect(response.body.success).toBe(false);
    expect(response.body.error).toBe("Validation failed");

    expect(response.body.details).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          field: "query.category",
        }),
      ]),
    );

    expect(mockedGetMenu).not.toHaveBeenCalled();
  });

  it("should return 400 when page is invalid", async () => {
    const response = await request(createTestApp())
      .get("/api/menu/list")
      .query({
        category: "All",
        page: "abc",
      });

    expect(response.status).toBe(400);

    expect(response.body.success).toBe(false);
    expect(response.body.error).toBe("Validation failed");

    expect(response.body.details).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          field: "query.page",
          message: "Page must be a valid number",
        }),
      ]),
    );

    expect(mockedGetMenu).not.toHaveBeenCalled();
  });

  it("should return 400 when limit is invalid", async () => {
    const response = await request(createTestApp())
      .get("/api/menu/list")
      .query({
        category: "All",
        limit: "abc",
      });

    expect(response.status).toBe(400);

    expect(response.body.success).toBe(false);
    expect(response.body.error).toBe("Validation failed");

    expect(response.body.details).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          field: "query.limit",
          message: "Limit must be a valid number",
        }),
      ]),
    );

    expect(mockedGetMenu).not.toHaveBeenCalled();
  });

  it("should return 500 when service throws an error", async () => {
    mockedGetMenu.mockRejectedValueOnce(new Error("Menu service failed"));

    const response = await request(createTestApp())
      .get("/api/menu/list")
      .query({
        category: "All",
      });

    expect(response.status).toBe(500);

    expect(response.body).toEqual({
      success: false,
      error: "Menu service failed",
    });
  });

  it("should use statusCode from error when present", async () => {
    const customError: any = new Error("Menu not found");
    customError.statusCode = 404;

    mockedGetMenu.mockRejectedValueOnce(customError);

    const response = await request(createTestApp())
      .get("/api/menu/list")
      .query({
        category: "All",
      });

    expect(response.status).toBe(404);

    expect(response.body).toEqual({
      success: false,
      error: "Menu not found",
    });
  });
});
