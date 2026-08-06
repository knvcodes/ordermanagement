import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import Toast from "@/components/layout/Toast";
import { useUiStore } from "@/store/uiStore";

describe("Toast", () => {
  beforeEach(() => useUiStore.setState({ toasts: [] }));

  it("renders notifications and dismisses one", async () => {
    useUiStore.setState({ toasts: [{ id: "notice", message: "Saved successfully", type: "success" }] });
    const user = userEvent.setup();
    render(<Toast />);

    expect(screen.getByText("Saved successfully")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Dismiss notification" }));
    expect(screen.queryByText("Saved successfully")).not.toBeInTheDocument();
  });
});
