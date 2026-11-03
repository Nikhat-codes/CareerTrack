"use strict";

const mongoose = require("mongoose");

async function connectDB() {
  const connectionString = process.env.MONGODB_URI;

  if (!connectionString) {
    throw new Error("MONGODB_URI is missing from Backend/.env");
  }

  await mongoose.connect(connectionString, {
    dbName: "careertrack"
  });

  console.log(`MongoDB connected to database: ${mongoose.connection.name}`);
}

module.exports = connectDB;