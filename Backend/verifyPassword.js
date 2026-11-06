"use strict";

require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Admin = require("./src/models/admin");

async function verifyPassword() {
    try {
        const { MONGODB_URI, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;

        if (!MONGODB_URI || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
            throw new Error("Check your .env variables.");
        }

        await mongoose.connect(MONGODB_URI, {
            dbName: "careertrack"
        });

        const email = ADMIN_EMAIL.trim().toLowerCase();

        const admin = await Admin.findOne({ email }).select("+password");

        if (!admin) {
            throw new Error("Admin account not found.");
        }

        const result = await bcrypt.compare(
            ADMIN_PASSWORD,
            admin.password
        );

        console.log("Admin account found.");
        console.log("Password Match:", result);

    } catch (error) {
        console.error("ERROR:", error.message);
        process.exitCode = 1;

    } finally {
        if (mongoose.connection.readyState !== 0) {
            await mongoose.disconnect();
        }
    }
}

verifyPassword();