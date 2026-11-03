"use strict";

require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Admin = require("./src/models/admin");

async function createAdmin() {
    const {
        MONGODB_URI,
        ADMIN_NAME,
        ADMIN_EMAIL,
        ADMIN_PASSWORD
    } = process.env;

    if (!MONGODB_URI || !ADMIN_NAME || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
        throw new Error("Please check your .env file.");
    }

    if (ADMIN_PASSWORD.length < 12) {
        throw new Error("Password must be at least 12 characters.");
    }

    await mongoose.connect(MONGODB_URI, {
        dbName: "careertrack"
    });

    console.log("MongoDB connected.");

    const email = ADMIN_EMAIL.trim().toLowerCase();

    const existingAdmin = await Admin.findOne({ email });

    if (existingAdmin) {
        console.log("Admin already exists!");
        return;
    }

    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 12);

    await Admin.create({
        name: ADMIN_NAME.trim(),
        email: email,
        password: hashedPassword,
        role: "admin"
    });

    console.log("================================");
    console.log("ADMIN CREATED SUCCESSFULLY!");
    console.log("Email:", email);
    console.log("================================");
}

createAdmin()
    .catch(function (error) {
        console.error("ERROR:", error.message);
        process.exitCode = 1;
    })
    .finally(function () {
        mongoose.disconnect();
    });