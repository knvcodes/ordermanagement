import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Spinner from "@/components/common/Spinner";

describe("Spinner", () => {
  it("exposes an accessible loading status and requested size", () => {
    render(<Spinner size="lg" />);
    expect(screen.getByRole("status", { name: "Loading" })).toHaveClass("spinner-lg");
  });
});
