import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import CartItem from '@/components/cart/CartItem';
import { useCartStore } from '@/store/cartStore';
import type { CartItem as CartItemType } from '@/utils/types';

const baseMenuItem = {
  _id: 'burger-001',
  name: 'Classic Burger',
  description: 'Beef patty with lettuce and tomato',
  price: 1000,
  category: 'Burger',
  image: '/images/burger.jpg',
  isAvailable: true,
  __v: 0,
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
};

const mockCartItem: CartItemType = {
  ...baseMenuItem,
  quantity: 2,
};

const originalCartActions = {
  addItem: useCartStore.getState().addItem,
  updateQuantity: useCartStore.getState().updateQuantity,
  removeItem: useCartStore.getState().removeItem,
};

describe('CartItem', () => {
  beforeEach(() => {
    useCartStore.setState({
      items: [],
      ...originalCartActions,
    });
  });

  it('renders item name, unit price, quantity, and line total', () => {
    render(<CartItem item={mockCartItem} />);

    expect(screen.getByText('Classic Burger')).toBeInTheDocument();
    expect(screen.getByText('$10.00 each')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('$20.00')).toBeInTheDocument();
  });

  it('calls addItem when the increase button is clicked', async () => {
    const user = userEvent.setup();

    const addItemSpy = vi.fn();

    useCartStore.setState({
      items: [{ ...mockCartItem }],
      addItem: addItemSpy as unknown as typeof originalCartActions.addItem,
    });

    render(<CartItem item={mockCartItem} />);

    const increaseButton = screen.getByRole('button', {
      name: /increase.*classic burger.*quantity/i,
    });

    await user.click(increaseButton);

    expect(addItemSpy).toHaveBeenCalledWith(mockCartItem);
  });

  it('calls updateQuantity when the decrease button is clicked', async () => {
    const user = userEvent.setup();

    const updateQuantitySpy = vi.fn();

    useCartStore.setState({
      items: [{ ...mockCartItem }],
      updateQuantity:
        updateQuantitySpy as unknown as typeof originalCartActions.updateQuantity,
    });

    render(<CartItem item={mockCartItem} />);

    const decreaseButton = screen.getByRole('button', {
      name: /decrease.*classic burger.*quantity/i,
    });

    await user.click(decreaseButton);

    expect(updateQuantitySpy).toHaveBeenCalledWith('burger-001', 1);
  });

  it('calls removeItem when the remove button is clicked', async () => {
    const user = userEvent.setup();

    const removeItemSpy = vi.fn();

    useCartStore.setState({
      items: [{ ...mockCartItem }],
      removeItem:
        removeItemSpy as unknown as typeof originalCartActions.removeItem,
    });

    render(<CartItem item={mockCartItem} />);

    const removeButton = screen.getByRole('button', {
      name: /remove.*classic burger.*from cart/i,
    });

    await user.click(removeButton);

    expect(removeItemSpy).toHaveBeenCalledWith('burger-001');
  });
});
