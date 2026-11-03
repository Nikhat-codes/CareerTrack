"use strict";

const express = require("express");

const protectAdmin = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const {
applyForJob,
getAllApplications,
updateApplicationStatus,
deleteApplication,
exportApplications,
downloadResume,
trackApplication
} = require("../controllers/applicationController");

const router = express.Router();

// Candidate applies for a job
router.post("/", upload.single("resume"), applyForJob);

// Candidate tracks application
router.post("/track", trackApplication);

// Admin routes
router.get("/", protectAdmin, getAllApplications);

// Export applications as CSV
router.get("/export/csv", protectAdmin, exportApplications);

// Download candidate resume (Admin only)
router.get("/:id/resume", protectAdmin, downloadResume);

// Update application status
router.patch("/:id/status", protectAdmin, updateApplicationStatus);

// Delete application
router.delete("/:id", protectAdmin, deleteApplication);

module.exports = router;
