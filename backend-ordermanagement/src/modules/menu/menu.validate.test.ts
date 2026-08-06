import { describe, expect, it } from "vitest";
import { menuListingSchema } from "./menu.validate.js";

describe("menuListingSchema", () => {
  it("should accept a valid query", () => {
    const result = menuListingSchema.safeParse({
      query: {
        category: "All",
        search: "pizza",
        page: "1",
        limit: "10",
      },
    });

    expect(result.success).toBe(true);
  });

  it("should require category", () => {
    const result = menuListingSchema.safeParse({
      query: {
        page: "1",
        limit: "10",
      },
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      const hasCategoryError = result.error.issues.some((issue) =>
        issue.path.includes("category"),
      );

      expect(hasCategoryError).toBe(true);
    }
  });

  it("should reject invalid category", () => {
    const result = menuListingSchema.safeParse({
      query: {
        category: "InvalidCategory",
      },
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      const hasCategoryError = result.error.issues.some((issue) =>
        issue.path.includes("category"),
      );

      expect(hasCategoryError).toBe(true);
    }
  });

  it("should accept all valid categories", () => {
    const validCategories = [
      "All",
      "Pizza",
      "Burger",
      "Pasta",
      "Salad",
      "Drink",
      "Dessert",
    ];

    for (const category of validCategories) {
      const result = menuListingSchema.safeParse({
        query: {
          category,
        },
      });

      expect(result.success).toBe(true);
    }
  });

  it("should reject non-numeric page", () => {
    const result = menuListingSchema.safeParse({
      query: {
        category: "All",
        page: "abc",
      },
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      const hasPageError = result.error.issues.some((issue) =>
        issue.path.includes("page"),
      );

      expect(hasPageError).toBe(true);

      const pageIssue = result.error.issues.find((issue) =>
        issue.path.includes("page"),
      );

      expect(pageIssue?.message).toBe("Page must be a valid number");
    }
  });

  it("should reject non-numeric limit", () => {
    const result = menuListingSchema.safeParse({
      query: {
        category: "All",
        limit: "abc",
      },
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      const hasLimitError = result.error.issues.some((issue) =>
        issue.path.includes("limit"),
      );

      expect(hasLimitError).toBe(true);

      const limitIssue = result.error.issues.find((issue) =>
        issue.path.includes("limit"),
      );

      expect(limitIssue?.message).toBe("Limit must be a valid number");
    }
  });

  it("should allow optional search", () => {
    const result = menuListingSchema.safeParse({
      query: {
        category: "Pizza",
      },
    });

    expect(result.success).toBe(true);
  });

  it("should allow optional page and limit", () => {
    const result = menuListingSchema.safeParse({
      query: {
        category: "Burger",
      },
    });

    expect(result.success).toBe(true);
  });
});
