"use strict";

const express = require("express");

const protectAdmin = require("../middleware/authMiddleware");

const {
  createJob,
  getAllJobs,
  updateJob,
  deleteJob
} = require("../controllers/adminJobController");

const router = express.Router();

// All routes require admin authentication
router.use(protectAdmin);

// Create job
router.post("/", createJob);

// Get all jobs
router.get("/", getAllJobs);

// Update job
router.put("/:id", updateJob);

// Delete job
router.delete("/:id", deleteJob);

module.exports = router;