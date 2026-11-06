"use strict";

const mongoose = require("mongoose");
const Application = require("../models/application");
const Job = require("../models/job");
const cloudinary = require("../config/cloudinary");
const crypto = require("crypto");
const path = require("path");

// 1. CANDIDATE APPLY FOR JOB
async function applyForJob(req, res, next) {
  let uploadedFile = null;

  try {
    const {
      jobId,
      candidateName,
      email,
      phone,
      education,
      experience,
      skills,
      coverLetter
    } = req.body || {};

    const requiredFields = {
      jobId,
      candidateName,
      email,
      phone,
      education
    };

    const missingFields = Object.entries(requiredFields)
      .filter(([, value]) =>
        typeof value !== "string" || !value.trim()
      )
      .map(([key]) => key);

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields.",
        missingFields
      });
    }

    if (!mongoose.isValidObjectId(jobId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid job ID."
      });
    }

    const job = await Job.findOne({
      _id: jobId,
      status: "published",
      $or: [
        { expiresAt: null },
        { expiresAt: { $gt: new Date() } }
      ]
    });

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job is no longer available."
      });
    }

    if (!req.file || !req.file.buffer) {
      return res.status(400).json({
        success: false,
        message: "Please upload your resume."
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existingApplication = await Application.findOne({
      job: jobId,
      email: normalizedEmail
    });

    if (existingApplication) {
      return res.status(409).json({
        success: false,
        message: "You have already applied for this job."
      });
    }

    const extension = path.extname(
      req.file.originalname
    ).toLowerCase();

    const uniqueName = crypto.randomBytes(16).toString("hex");
    const publicId = `careertrack/resumes/${uniqueName}${extension}`;

    uploadedFile = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          resource_type: "raw",
          type: "authenticated",
          public_id: publicId,
          overwrite: false
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );

      stream.end(req.file.buffer);
    });

    const skillsArray = Array.isArray(skills)
      ? skills
      : typeof skills === "string"
        ? skills.split(",").map(item => item.trim()).filter(Boolean)
        : [];

    const application = await Application.create({
      job: jobId,
      candidateName: candidateName.trim(),
      email: normalizedEmail,
      phone: phone.trim(),
      education: education.trim(),
      experience: experience || "Fresher",
      skills: skillsArray,
      coverLetter: coverLetter || "",
      resume: {
        filename: `${uniqueName}${extension}`,
        path: "",
        mimetype: req.file.mimetype,
        publicId: uploadedFile.public_id,
        resourceType: "raw",
        storageType: "cloudinary"
      }
    });

    return res.status(201).json({
      success: true,
      message: "Application submitted successfully.",
      data: {
        applicationId: application._id
      }
    });

  } catch (error) {
    if (uploadedFile?.public_id) {
      await cloudinary.uploader.destroy(
        uploadedFile.public_id,
        {
          resource_type: "raw",
          type: "authenticated"
        }
      ).catch(cleanupError => {
        console.error("Cloudinary cleanup error:", cleanupError);
      });
    }

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "You have already applied for this job."
      });
    }

    next(error);
  }
}


// 2. GET ALL APPLICATIONS WITH FILTERS
async function getAllApplications(req, res, next) {
  try {
    const {
      status,
      jobId,
      startDate,
      endDate,
      page = 1,
      limit = 10
    } = req.query;

    const currentPage = Math.max(
      parseInt(page, 10) || 1,
      1
    );

    const pageSize = Math.min(
      Math.max(parseInt(limit, 10) || 10, 1),
      50
    );

    const filters = {};

    const allowedStatuses = [
      "Submitted",
      "Under Review",
      "Shortlisted",
      "Interview Scheduled",
      "Selected",
      "Rejected"
    ];

    if (status) {
      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Invalid application status."
        });
      }

      filters.status = status;
    }

    if (jobId) {
      if (!mongoose.isValidObjectId(jobId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid job ID."
        });
      }

      filters.job = jobId;
    }

    if (startDate || endDate) {
      const dateFilter = {};

      const isValidDate = date => {
        if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
          return false;
        }

        const parsed = new Date(`${date}T00:00:00.000Z`);

        return (
          !Number.isNaN(parsed.getTime()) &&
          parsed.toISOString().slice(0, 10) === date
        );
      };

      if (startDate) {
        if (!isValidDate(startDate)) {
          return res.status(400).json({
            success: false,
            message: "Invalid start date."
          });
        }

        dateFilter.$gte = new Date(
          `${startDate}T00:00:00.000Z`
        );
      }

      if (endDate) {
        if (!isValidDate(endDate)) {
          return res.status(400).json({
            success: false,
            message: "Invalid end date."
          });
        }

        const nextDay = new Date(
          `${endDate}T00:00:00.000Z`
        );

        nextDay.setUTCDate(nextDay.getUTCDate() + 1);
        dateFilter.$lt = nextDay;
      }

      if (
        dateFilter.$gte &&
        dateFilter.$lt &&
        dateFilter.$gte >= dateFilter.$lt
      ) {
        return res.status(400).json({
          success: false,
          message: "Start date must be before or equal to end date."
        });
      }

      filters.createdAt = dateFilter;
    }

    const [applications, total] = await Promise.all([
      Application.find(filters)
        .populate("job", "title company location")
        .sort({ createdAt: -1 })
        .skip((currentPage - 1) * pageSize)
        .limit(pageSize)
        .lean(),

      Application.countDocuments(filters)
    ]);

    res.json({
      success: true,
      data: applications,
      pagination: {
        page: currentPage,
        limit: pageSize,
        total,
        pages: Math.ceil(total / pageSize)
      }
    });

  } catch (error) {
    next(error);
  }
}


// 3. UPDATE APPLICATION STATUS AND NOTES
async function updateApplicationStatus(req, res, next) {
  try {
    const { status, notes } = req.body;

    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid application ID."
      });
    }

    const allowedStatuses = [
      "Submitted",
      "Under Review",
      "Shortlisted",
      "Interview Scheduled",
      "Selected",
      "Rejected"
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid application status."
      });
    }

    const updates = { status };

    if (typeof notes === "string") {
      updates.notes = notes.trim();
    }

    const application = await Application.findByIdAndUpdate(
      req.params.id,
      updates,
      {
        new: true,
        runValidators: true
      }
    ).populate("job", "title company");

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found."
      });
    }

    res.json({
      success: true,
      message: "Application status updated successfully.",
      data: application
    });

  } catch (error) {
    next(error);
  }
}


// 4. DELETE APPLICATION
async function deleteApplication(req, res, next) {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid application ID."
      });
    }

    const application = await Application.findByIdAndDelete(
      req.params.id
    );

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found."
      });
    }

    if (
      application.resume?.storageType === "cloudinary" &&
      application.resume.publicId
    ) {
      await cloudinary.uploader.destroy(
        application.resume.publicId,
        {
          resource_type: "raw",
          type: "authenticated"
        }
      ).catch(error => {
        console.error("Resume cleanup error:", error);
      });
    }

    res.json({
      success: true,
      message: "Application deleted successfully."
    });

  } catch (error) {
    next(error);
  }
}


// 5. DOWNLOAD CANDIDATE RESUME
async function downloadResume(req, res, next) {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid application ID."
      });
    }

    const application = await Application.findById(req.params.id);

    if (!application || !application.resume?.filename) {
      return res.status(404).json({
        success: false,
        message: "Resume not found."
      });
    }

    if (
      application.resume.storageType !== "cloudinary" ||
      !application.resume.publicId
    ) {
      return res.status(404).json({
        success: false,
        message: "Resume is not available in cloud storage."
      });
    }

    const downloadUrl = cloudinary.utils.private_download_url(
      application.resume.publicId,
      null,
      {
        resource_type: "raw",
        type: "authenticated",
        attachment: true,
        expires_at: Math.floor(Date.now() / 1000) + 300
      }
    );

    return res.redirect(downloadUrl);

  } catch (error) {
    next(error);
  }
}


// 6. TRACK CANDIDATE APPLICATION
async function trackApplication(req, res, next) {
  try {
    const { applicationId, email } = req.body || {};

    if (
      typeof applicationId !== "string" ||
      !mongoose.isValidObjectId(applicationId) ||
      typeof email !== "string" ||
      !email.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Valid application ID and email are required."
      });
    }

    const application = await Application.findOne({
      _id: applicationId,
      email: email.trim().toLowerCase()
    })
      .populate("job", "title company location")
      .select("job status createdAt updatedAt");

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "No application found with these details."
      });
    }

    return res.status(200).json({
      success: true,
      message: "Application found successfully.",
      data: {
        applicationId: application._id,
        job: application.job,
        status: application.status,
        appliedAt: application.createdAt,
        lastUpdated: application.updatedAt
      }
    });

  } catch (error) {
    next(error);
  }
}


// 7. EXPORT APPLICATIONS AS CSV
async function exportApplications(req, res, next) {
  try {
    const applications = await Application.find()
      .populate("job", "title company")
      .sort({ createdAt: -1 })
      .lean();

    const escapeCSV = value => {
      let text = String(value ?? "");

      if (/^[\s]*[=+\-@]/.test(text)) {
        text = "'" + text;
      }

      return `"${text.replace(/"/g, '""')}"`;
    };

    const formatAppliedDate = date => {
      if (!date) return "";

      return new Intl.DateTimeFormat("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        timeZone: "Asia/Kolkata"
      }).format(new Date(date));
    };

    const headers = [
      "Candidate Name",
      "Email",
      "Phone",
      "Job Title",
      "Company",
      "Education",
      "Experience",
      "Skills",
      "Cover Letter",
      "Status",
      "Applied Date"
    ];

    const rows = applications.map(app => [
      app.candidateName,
      app.email,
      app.phone ? `\t${app.phone}` : "",
      app.job?.title || "Deleted Job",
      app.job?.company || "",
      app.education,
      app.experience,
      (app.skills || []).join(", "),
      app.coverLetter,
      app.status,
      formatAppliedDate(app.createdAt)
    ]);

    const csv = [
      headers.map(escapeCSV).join(","),
      ...rows.map(row => row.map(escapeCSV).join(","))
    ].join("\r\n");

    res.setHeader(
      "Content-Type",
      "text/csv; charset=utf-8"
    );

    res.setHeader(
      "Content-Disposition",
      'attachment; filename="careertrack-applications.csv"'
    );

    res.send("\uFEFF" + csv);

  } catch (error) {
    next(error);
  }
}


// EXPORT CONTROLLERS
module.exports = {
  applyForJob,
  getAllApplications,
  updateApplicationStatus,
  deleteApplication,
  exportApplications,
  downloadResume,
  trackApplication
};