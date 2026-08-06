export const message = {
  menu: {
    success: {
      list: "Menu fetched successfully",
    },
  },
  orders: {
    success: {
      list: "User's orders fetched successfully",
      place: "Order placed successfully",
      details: "Order details fetched successfully",
      statusChange: "Order status updated successfully",
    },
    failed: {
      orderNotFound: "Order not found",
      orderItemMin: "Order must contain at least one item.",
    },
  },
  validation: {
    addDish: {
      name: {
        required: "Dish name is required",
        minLength: "Dish name must be at least 1 character",
      },
      description: {
        invalid: "Description must be a string",
      },
      isActive: {
        invalid: "isActive must be a boolean",
      },
      tags: {
        invalid: "Tags must be an array of strings",
      },
      metadata: {
        invalid: "Metadata must be an object",
      },
      supplements: {
        invalid: "Supplements must be an array of strings",
      },
      serving: {
        invalid: "Serving must be an array",
        title: {
          required: "Serving title is required",
          invalid: "Serving title must be a string",
        },
        value: {
          required: "Serving value is required",
          invalid: "Serving value must be a number",
        },
        price: {
          required: "Serving price is required",
          invalid: "Serving price must be a number",
        },
        currency: {
          required: "Serving currency is required",
          invalid: "Serving currency must be a string",
        },
      },
      restaurantId: {
        invalid: "Restaurant ID must be a valid string",
      },
    },
    user: {
      name: {
        required: "Name is required",
        min: "Name must have atleast 3 letters",
        invalid: "Please enter valid name",
      },
      email: {
        invalid: "Please enter valid email",
      },
      password: {
        notMatch: "Passwords do not match",
        token: "Invalid token. Please try again.",
        required: "Password is required",
        invalid:
          "Password must contain uppercase, lowercase, number, and special character, and be at least 8 characters long.",
      },
    },
  },
};
