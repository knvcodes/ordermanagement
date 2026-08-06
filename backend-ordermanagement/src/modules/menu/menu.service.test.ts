import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Request } from "express";
import { getMenu } from "./menu.service.js";
import Menu from "./menu.model.js";

vi.mock("./menu.model.js", () => ({
  default: {
    find: vi.fn(),
    countDocuments: vi.fn(),
  },
}));

const createRequest = (query: Record<string, unknown>) =>
  ({
    query,
  }) as unknown as Request;

describe("getMenu", () => {
  const menuDocuments = [
    {
      _id: "507f1f77bcf86cd799439011",
      name: "Margherita Pizza",
      description: "Classic pizza",
      price: 12.5,
      image: "/images/pizza.jpg",
      category: "Pizza",
      isAvailable: true,
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockFindChain = (resolvedData: unknown[]) => {
    const limit = vi.fn().mockResolvedValue(resolvedData);
    const skip = vi.fn().mockReturnValue({ limit });

    vi.mocked(Menu.find).mockReturnValue({ skip } as any);

    return {
      skip,
      limit,
    };
  };

  it("should return paginated menu data", async () => {
    const { skip, limit } = mockFindChain(menuDocuments);

    vi.mocked(Menu.countDocuments).mockResolvedValue(25 as any);

    const result = await getMenu(
      createRequest({
        page: "2",
        limit: "10",
        category: "All",
      }),
    );

    expect(Menu.find).toHaveBeenCalledWith({});
    expect(skip).toHaveBeenCalledWith(10);
    expect(limit).toHaveBeenCalledWith(10);
    expect(Menu.countDocuments).toHaveBeenCalledWith({});

    expect(result.data).toEqual(menuDocuments);
    expect(result.page).toBe("2");
    expect(result.total).toBe(25);
    expect(result.hasNext).toBe(true);
  });

  it("should calculate hasNext as false when there are no next pages", async () => {
    const { skip, limit } = mockFindChain(menuDocuments);

    vi.mocked(Menu.countDocuments).mockResolvedValue(10 as any);

    const result = await getMenu(
      createRequest({
        page: "1",
        limit: "10",
        category: "All",
      }),
    );

    expect(skip).toHaveBeenCalledWith(0);
    expect(limit).toHaveBeenCalledWith(10);
    expect(result.hasNext).toBe(false);
  });

  it("should add search filter when search query exists", async () => {
    mockFindChain([]);

    vi.mocked(Menu.countDocuments).mockResolvedValue(0 as any);

    await getMenu(
      createRequest({
        page: "1",
        limit: "10",
        search: "pizza",
        category: "All",
      }),
    );

    expect(Menu.find).toHaveBeenCalledWith({
      name: {
        $regex: "pizza",
        $options: "i",
      },
    });
  });

  it("should add category filter when category is not All", async () => {
    mockFindChain([]);

    vi.mocked(Menu.countDocuments).mockResolvedValue(0 as any);

    await getMenu(
      createRequest({
        page: "1",
        limit: "10",
        category: "Pizza",
      }),
    );

    expect(Menu.find).toHaveBeenCalledWith({
      category: "Pizza",
    });
  });

  it("should add both search and category filters together", async () => {
    mockFindChain([]);

    vi.mocked(Menu.countDocuments).mockResolvedValue(0 as any);

    await getMenu(
      createRequest({
        page: "1",
        limit: "10",
        search: "cheese",
        category: "Pizza",
      }),
    );

    expect(Menu.find).toHaveBeenCalledWith({
      name: {
        $regex: "cheese",
        $options: "i",
      },
      category: "Pizza",
    });
  });

  it("should use default pagination values when query params are missing", async () => {
    const { skip, limit } = mockFindChain([]);

    vi.mocked(Menu.countDocuments).mockResolvedValue(0 as any);

    const result = await getMenu(createRequest({}));

    expect(skip).toHaveBeenCalledWith(0);
    expect(limit).toHaveBeenCalledWith(10);
    expect(result.page).toBe(1);
    expect(result.total).toBe(0);
    expect(result.hasNext).toBe(false);
  });

  it("should rethrow service errors", async () => {
    vi.mocked(Menu.find).mockImplementation(() => {
      throw new Error("Database error");
    });

    await expect(
      getMenu(
        createRequest({
          category: "All",
        }),
      ),
    ).rejects.toThrow("Database error");
  });
});
