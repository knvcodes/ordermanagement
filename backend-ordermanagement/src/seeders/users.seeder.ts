// seeder/users.seeder.js

import Users from "../modules/users/users.model.js";
import { ADMIN, CUSTOMER } from "../config/vars.js";

// Static user data
const STATIC_USERS = [
  {
    name: "Admin User",
    email: "admin@restaurant.com",
    phone: "9000000001",
    role: ADMIN,
  },

  {
    name: "Alice Cooper",
    email: "alice@email.com",
    phone: "9000000002",
    role: CUSTOMER,
  },
  {
    name: "Bob Martin",
    email: "bob@email.com",
    phone: "9000000003",
    role: CUSTOMER,
  },
  {
    name: "Charlie Parker",
    email: "charlie@email.com",
    phone: "9000000004",
    role: CUSTOMER,
  },
  {
    name: "Diana Prince",
    email: "diana@email.com",
    phone: "9000000005",
    role: CUSTOMER,
  },
  {
    name: "Eve Johnson",
    email: "eve@email.com",
    phone: "9000000006",
    role: CUSTOMER,
  },
  {
    name: "Frank Castle",
    email: "frank@email.com",
    phone: "9000000007",
    role: CUSTOMER,
  },
  {
    name: "Grace Hopper",
    email: "grace@email.com",
    phone: "9000000008",
    role: CUSTOMER,
  },
  {
    name: "Henry Ford",
    email: "henry@email.com",
    phone: "9000000009",
    role: CUSTOMER,
  },
  {
    name: "Ivy League",
    email: "ivy@email.com",
    phone: "9000000010",
    role: CUSTOMER,
  },
  {
    name: "Jack Ryan",
    email: "jack@email.com",
    phone: "9000000011",
    role: CUSTOMER,
  },
  {
    name: "Kate Bishop",
    email: "kate@email.com",
    phone: "9000000012",
    role: CUSTOMER,
  },
  {
    name: "Liam Neeson",
    email: "liam@email.com",
    phone: "9000000013",
    role: CUSTOMER,
  },
  {
    name: "Mia Wallace",
    email: "mia@email.com",
    phone: "9000000014",
    role: CUSTOMER,
  },
  {
    name: "Noah Ark",
    email: "noah@email.com",
    phone: "9000000015",
    role: CUSTOMER,
  },
  {
    name: "Olivia Pope",
    email: "olivia@email.com",
    phone: "9000000016",
    role: CUSTOMER,
  },
  {
    name: "Peter Parker",
    email: "peter@email.com",
    phone: "9000000017",
    role: CUSTOMER,
  },
  {
    name: "Quinn Fabray",
    email: "quinn@email.com",
    phone: "9000000018",
    role: CUSTOMER,
  },
];

// Seeder
export async function seedUsers() {
  try {
    await Users.deleteMany({});
    console.log("🗑️ Cleared existing users");

    await Users.insertMany(STATIC_USERS);

    console.log(`✅ Seeded ${STATIC_USERS.length} users`);
    console.log(`   - 1 admin`);
    console.log(`   - ${STATIC_USERS.length - 1} customers`);
  } catch (error) {
    console.error("❌ Seeder failed:", error);
    throw error;
  }
}
