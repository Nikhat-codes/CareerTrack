"use strict";

const Job = require("../models/Job");
const Application = require("../models/application");

async function getDashboardStats(req, res, next) {
  try {
    const [
      totalJobs,
      publishedJobs,
      draftJobs,
      closedJobs,
      totalApplications,
      submittedApplications,
      underReviewApplications,
      shortlistedApplications,
      selectedApplications,
      rejectedApplications,
      recentApplications
    ] = await Promise.all([
      Job.countDocuments(),
      Job.countDocuments({ status: "published" }),
      Job.countDocuments({ status: "draft" }),
      Job.countDocuments({ status: "closed" }),

      Application.countDocuments(),
      Application.countDocuments({ status: "Submitted" }),
      Application.countDocuments({ status: "Under Review" }),
      Application.countDocuments({ status: "Shortlisted" }),
      Application.countDocuments({ status: "Selected" }),
      Application.countDocuments({ status: "Rejected" }),

      Application.find()
        .populate("job", "title company")
        .sort({ createdAt: -1 })
        .limit(5)
        .lean()
    ]);

    res.json({
      success: true,
      data: {
        jobs: {
          total: totalJobs,
          published: publishedJobs,
          draft: draftJobs,
          closed: closedJobs
        },

        applications: {
          total: totalApplications,
          submitted: submittedApplications,
          underReview: underReviewApplications,
          shortlisted: shortlistedApplications,
          selected: selectedApplications,
          rejected: rejectedApplications
        },

        recentApplications
      }
    });

  } catch (error) {
    next(error);
  }
}

module.exports = {
  getDashboardStats
};