"use strict";

require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Admin = require("./src/models/admin");

async function verifyPassword() {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            dbName: "careertrack"
        });

        const email = process.env.ADMIN_EMAIL.trim().toLowerCase();
        const password = process.env.ADMIN_PASSWORD;

        const admin = await Admin.findOne({ email }).select("+password");

        const result = await bcrypt.compare(password, admin.password);

        console.log("Email:", email);
        console.log("Password Match:", result);

    } catch (error) {
        console.log("ERROR:", error.message);
    } finally {
        await mongoose.disconnect();
    }
}

verifyPassword();