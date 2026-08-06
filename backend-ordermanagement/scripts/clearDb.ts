import mongoose from "mongoose";

const MONGO_URI =
  process.env.MONGO_URI || "mongodb://127.0.0.1:27017/ordermanagement";

export const cleardb = async () => {
  await mongoose.connect(MONGO_URI);

  const db = mongoose.connection.db;

  db && (await db.collection("users").drop());
  db && (await db.collection("orders").drop());
  db && (await db.collection("orderitems").drop());
  db && (await db.collection("menus").drop());
  console.log("Database collection dropped successfully");

  await mongoose.disconnect();
};

cleardb();
