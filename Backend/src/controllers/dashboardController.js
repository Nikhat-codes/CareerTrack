"use strict";

const Job = require("../models/job");
const Application = require("../models/application");

async function getDashboardStats(req, res, next) {
  try {
    const now = new Date();

    const [
      totalJobs,
      publishedJobs,
      activeJobs,
      expiredJobs,
      draftJobs,
      closedJobs,

      totalApplications,
      submittedApplications,
      underReviewApplications,
      shortlistedApplications,
      interviewScheduledApplications,
      selectedApplications,
      rejectedApplications,

      recentApplications
    ] = await Promise.all([

      // JOB STATISTICS
      Job.countDocuments(),

      Job.countDocuments({
        status: "published"
      }),

      // Published jobs that have not expired
      Job.countDocuments({
        status: "published",
        $or: [
          { expiresAt: null },
          { expiresAt: { $exists: false } },
          { expiresAt: { $gt: now } }
        ]
      }),

      // Published jobs whose expiry date has passed
      Job.countDocuments({
        status: "published",
        expiresAt: { $lte: now }
      }),

      Job.countDocuments({
        status: "draft"
      }),

      Job.countDocuments({
        status: "closed"
      }),

      // APPLICATION STATISTICS
      Application.countDocuments(),

      Application.countDocuments({
        status: "Submitted"
      }),

      Application.countDocuments({
        status: "Under Review"
      }),

      Application.countDocuments({
        status: "Shortlisted"
      }),

      Application.countDocuments({
        status: "Interview Scheduled"
      }),

      Application.countDocuments({
        status: "Selected"
      }),

      Application.countDocuments({
        status: "Rejected"
      }),

      // RECENT APPLICATIONS
      Application.find()
        .populate("job", "title company")
        .sort({ createdAt: -1 })
        .limit(5)
        .lean()
    ]);

    // Pending = Submitted + Under Review
    const pendingApplications =
      submittedApplications + underReviewApplications;

    res.json({
      success: true,

      data: {
        jobs: {
          total: totalJobs,
          published: publishedJobs,
          active: activeJobs,
          expired: expiredJobs,
          draft: draftJobs,
          closed: closedJobs
        },

        applications: {
          total: totalApplications,
          pending: pendingApplications,
          submitted: submittedApplications,
          underReview: underReviewApplications,
          shortlisted: shortlistedApplications,
          interviewScheduled: interviewScheduledApplications,
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