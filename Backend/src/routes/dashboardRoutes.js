"use strict";

const express = require("express");

const protectAdmin = require("../middleware/authMiddleware");

const {
  getDashboardStats
} = require("../controllers/dashboardController");

const router = express.Router();

// Protect dashboard API
router.use(protectAdmin);

// Dashboard statistics
router.get("/stats", getDashboardStats);

module.exports = router;