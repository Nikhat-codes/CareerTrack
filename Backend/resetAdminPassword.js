"use strict";

require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Admin = require("./src/models/admin");

async function resetPassword() {
    let connected = false;

    try {
        const email = process.env.ADMIN_EMAIL;
        const password = process.env.ADMIN_PASSWORD;
        const uri = process.env.MONGODB_URI;

        if (!email || !password || !uri) {
            throw new Error("Check your .env variables.");
        }

        if (password.length < 12) {
            throw new Error("Password must be at least 12 characters.");
        }

        await mongoose.connect(uri, {
            dbName: "careertrack"
        });

        connected = true;

        console.log("MongoDB connected.");

        const admin = await Admin.findOne({
            email: email.trim().toLowerCase()
        });

        if (!admin) {
            throw new Error("Admin account not found.");
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        admin.password = hashedPassword;

        await admin.save();

        console.log("PASSWORD RESET SUCCESSFUL!");
        console.log("Admin Email:", email);

    } catch (error) {
        console.error("ERROR:", error.message);

    } finally {
        if (connected) {
            await mongoose.disconnect();
            console.log("MongoDB disconnected.");
        }
    }
}

resetPassword();