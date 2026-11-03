"use strict";

const mongoose = require("mongoose");
const Job = require("../models/Job");

// CREATE JOB
async function createJob(req, res, next) {
  try {
    const {
      title,
      company,
      location,
      workMode,
      employmentType,
      salary,
      summary,
      description,
      responsibilities,
      qualifications,
      skills,
      status,
      expiresAt
    } = req.body;

    const job = await Job.create({
      title,
      company,
      location,
      workMode,
      employmentType,
      salary,
      summary,
      description,
      responsibilities,
      qualifications,
      skills,
      status: status || "draft",
      publishedAt: status === "published" ? new Date() : null,
      expiresAt: expiresAt || null
    });

    res.status(201).json({
      success: true,
      message: "Job created successfully.",
      data: job
    });
  } catch (error) {
    next(error);
  }
}

// GET ALL JOBS FOR ADMIN
async function getAllJobs(req, res, next) {
  try {
    const jobs = await Job.find()
      .sort({ createdAt: -1 })
      .lean();

    res.json({
      success: true,
      count: jobs.length,
      data: jobs
    });
  } catch (error) {
    next(error);
  }
}

// UPDATE JOB
async function updateJob(req, res, next) {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid job ID."
      });
    }

    const updates = { ...req.body };

    delete updates._id;
    delete updates.createdAt;
    delete updates.updatedAt;

    if (updates.status === "published") {
      updates.publishedAt = new Date();
    }

    const job = await Job.findByIdAndUpdate(
      req.params.id,
      updates,
      {
        new: true,
        runValidators: true
      }
    );

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found."
      });
    }

    res.json({
      success: true,
      message: "Job updated successfully.",
      data: job
    });
  } catch (error) {
    next(error);
  }
}

// DELETE JOB
async function deleteJob(req, res, next) {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid job ID."
      });
    }

    const job = await Job.findByIdAndDelete(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found."
      });
    }

    res.json({
      success: true,
      message: "Job deleted successfully."
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createJob,
  getAllJobs,
  updateJob,
  deleteJob
};