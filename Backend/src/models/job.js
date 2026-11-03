"use strict";

const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    company: {
      type: String,
      required: true,
      trim: true,
    },

    location: {
      type: String,
      required: true,
      trim: true,
    },

    workMode: {
      type: String,
      enum: ["On-site", "Hybrid", "Remote"],
      default: "On-site",
    },

    employmentType: {
      type: String,
      enum: ["Full-time", "Part-time", "Contract", "Internship"],
      default: "Full-time",
    },

    salary: {
      type: String,
      trim: true,
      default: "Not specified",
    },

    // NEW FIELD: Experience Required
    experience: {
      type: String,
      trim: true,
      default: "Not specified",
    },

    summary: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    responsibilities: {
      type: [String],
      default: [],
    },

    qualifications: {
      type: [String],
      default: [],
    },

    skills: {
      type: [String],
      default: [],
    },

    // NEW FIELD: Benefits
    benefits: {
      type: [String],
      default: [],
    },

    // NEW FIELD: Application Instructions
    applicationInstructions: {
      type: String,
      trim: true,
      default: "",
    },

    status: {
      type: String,
      enum: ["draft", "published", "closed"],
      default: "draft",
    },

    publishedAt: {
      type: Date,
      default: null,
    },

    expiresAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Database indexes
jobSchema.index({ status: 1, publishedAt: -1 });

jobSchema.index({
  title: "text",
  company: "text",
  skills: "text",
});

module.exports = mongoose.model("Job", jobSchema);