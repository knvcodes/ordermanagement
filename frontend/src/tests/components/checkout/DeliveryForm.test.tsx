import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect, vi } from "vitest";
import DeliveryForm from "@/components/checkout/DeliveryForm";

describe("DeliveryForm", () => {
  it("shows validation errors when submitting an empty form", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    render(
      <MemoryRouter>
        <DeliveryForm onSubmit={onSubmit} isCreating={false} />
      </MemoryRouter>,
    );

    await user.click(
      screen.getByRole("button", { name: /place order|submit/i }),
    );

    expect(
      await screen.findByText(/name must be at least 2 characters/i),
    ).toBeInTheDocument();
    expect(
      await screen.findByText(/address must be at least 10 characters/i),
    ).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("submits valid form data", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    render(
      <MemoryRouter>
        <DeliveryForm onSubmit={onSubmit} isCreating={false} />
      </MemoryRouter>,
    );

    await user.type(screen.getByLabelText(/full name/i), "John Doe");
    await user.type(
      screen.getByLabelText(/address/i),
      "123 Main Street, Springfield",
    );
    await user.type(screen.getByLabelText(/phone/i), "+1 555-123-4567");

    await user.click(
      screen.getByRole("button", { name: /place order|submit/i }),
    );

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledTimes(1);
    });
    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "John Doe",
        address: "123 Main Street, Springfield",
        phone: "+1 555-123-4567",
      }),
      expect.anything(),
    );
  });

  it("shows a spinner and disables repeat submissions while creating an order", () => {
    render(
      <MemoryRouter>
        <DeliveryForm onSubmit={vi.fn()} isCreating />
      </MemoryRouter>,
    );

    expect(screen.getByRole("status", { name: "Loading" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /placing order/i })).toBeDisabled();
  });
});
