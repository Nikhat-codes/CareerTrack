"use strict";

const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true
    },

    candidateName: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true
    },

    phone: {
      type: String,
      required: true,
      trim: true
    },

    education: {
      type: String,
      required: true,
      trim: true
    },

    experience: {
      type: String,
      default: "Fresher"
    },

    skills: {
      type: [String],
      default: []
    },

    coverLetter: {
      type: String,
      default: ""
    },
resume: {
  filename: String,
  path: String,
  mimetype: String,
  publicId: String,
  resourceType: {
    type: String,
    default: "raw"
  },
  storageType: {
    type: String,
    default: "local"
  }
},
    status: {
      type: String,
      enum: [
        "Submitted",
        "Under Review",
        "Shortlisted",
        "Interview Scheduled",
        "Selected",
        "Rejected"
      ],
      default: "Submitted"
    },

    notes: {
      type: String,
      default: ""
    }
  },
  {
    timestamps: true
  }
);

applicationSchema.index(
  { job: 1, email: 1 },
  { unique: true }
);

module.exports = mongoose.model("Application", applicationSchema);