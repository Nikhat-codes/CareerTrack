"use strict";

const mongoose = require("mongoose");
const Application = require("../models/application");
const Job = require("../models/job");
const fs = require("fs");
const path = require("path");
// 1. CANDIDATE APPLY FOR JOB
async function applyForJob(req, res, next) {
try {
console.log("APPLICATION BODY:", req.body);
console.log("UPLOADED FILE:", req.file);

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
        .filter(([key, value]) =>
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

    if (!req.file) {
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
            filename: req.file.filename,
            path: req.file.path,
            mimetype: req.file.mimetype
        }
    });

    return res.status(201).json({
        success: true,
        message: "Application submitted successfully.",
        data: application
    });

} catch (error) {
    console.error("APPLICATION ERROR:", error);

    if (error.code === 11000) {
        return res.status(409).json({
            success: false,
            message: "You have already applied for this job."
        });
    }

    next(error);
}

}

// 2. GET ALL APPLICATIONS
async function getAllApplications(req, res, next) {
try {
const {
status,
page = 1,
limit = 10
} = req.query;

    const currentPage = Math.max(parseInt(page, 10) || 1, 1);
    const pageSize = Math.min(Math.max(parseInt(limit, 10) || 10, 1), 50);

    const filters = {};

    if (status) {
        filters.status = status;
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

// 3. UPDATE APPLICATION STATUS
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
        { new: true, runValidators: true }
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


    const application = await Application.findByIdAndDelete(req.params.id);

    if (!application) {
        return res.status(404).json({
            success: false,
            message: "Application not found."
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
// DOWNLOAD CANDIDATE RESUME
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

    const uploadDirectory = path.resolve(
      __dirname,
      "../../uploads"
    );

    const filePath = path.resolve(
      uploadDirectory,
      path.basename(application.resume.filename)
    );

    if (!filePath.startsWith(uploadDirectory + path.sep)) {
      return res.status(403).json({
        success: false,
        message: "Invalid resume path."
      });
    }

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: "Resume file does not exist."
      });
    }

    res.download(
      filePath,
      application.resume.filename
    );

  } catch (error) {
    next(error);
  }
}
// TRACK CANDIDATE APPLICATION
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
// 5. EXPORT APPLICATIONS AS CSV
async function exportApplications(req, res, next) {
try {
const applications = await Application.find()
.populate("job", "title company")
.sort({ createdAt: -1 })
.lean();


    const escapeCSV = (value) => {
        let text = String(value ?? "");

        if (/^[\s]*[=+\-@\t\r]/.test(text)) {
            text = "'" + text;
        }

        return `"${text.replace(/"/g, '""')}"`;
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
        app.phone,
        app.job?.title || "Deleted Job",
        app.job?.company || "",
        app.education,
        app.experience,
        (app.skills || []).join(", "),
        app.coverLetter,
        app.status,
        app.createdAt?.toISOString() || ""
    ]);

    const csv = [
        headers.map(escapeCSV).join(","),
        ...rows.map(row => row.map(escapeCSV).join(","))
    ].join("\r\n");

    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader(
        "Content-Disposition",
        'attachment; filename="careertrack-applications.csv"'
    );

    res.send("\uFEFF" + csv);

} catch (error) {
    next(error);
}

}

module.exports = {
applyForJob,
getAllApplications,
updateApplicationStatus,
deleteApplication,
exportApplications,
downloadResume,
trackApplication
};
