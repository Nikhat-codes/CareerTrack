"use strict";

require("dotenv").config();

const mongoose = require("mongoose");
const Admin = require("./src/models/admin");

async function checkAdmin() {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            dbName: "careertrack"
        });

        const email = process.env.ADMIN_EMAIL.trim().toLowerCase();

        const admin = await Admin.findOne({ email });

        if (!admin) {
            console.log("ADMIN NOT FOUND!");
        } else {
            console.log("ADMIN FOUND!");
            console.log("Email:", admin.email);
            console.log("Name:", admin.name);
            console.log("Active:", admin.isActive);
            console.log("Role:", admin.role);
        }

    } catch (error) {
        console.log("ERROR:", error.message);
    } finally {
        await mongoose.disconnect();
    }
}

checkAdmin();
