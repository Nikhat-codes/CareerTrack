"use strict";

const Job = require("../models/job");

async function getPublicJobs(req, res, next) {
  try {
    const {
      search = "",
      location = "",
      type = "",
      workMode = "",
      sort = "newest",
      page = 1,
      limit = 10,
    } = req.query;

    const filters = {
      status: "published",
      $or: [{ expiresAt: null }, { expiresAt: { $gt: new Date() } }],
    };

    if (location.trim()) {
      filters.location = { $regex: location.trim(), $options: "i" };
    }

    if (type.trim()) {
      filters.employmentType = type.trim();
    }

    if (workMode.trim()) {
      filters.workMode = workMode.trim();
    }

    if (search.trim()) {
      filters.$text = { $search: search.trim() };
    }

    const sortOptions =
      sort === "oldest" ? { publishedAt: 1 } : { publishedAt: -1 };

    const currentPage = Math.max(Number.parseInt(page, 10) || 1, 1);
    const pageSize = Math.min(
      Math.max(Number.parseInt(limit, 10) || 10, 1),
      50
    );

    const [jobs, total] = await Promise.all([
      Job.find(filters)
        .sort(sortOptions)
        .skip((currentPage - 1) * pageSize)
        .limit(pageSize)
        .lean(),
      Job.countDocuments(filters),
    ]);

    res.json({
      success: true,
      data: jobs,
      pagination: {
        page: currentPage,
        limit: pageSize,
        total,
        pages: Math.ceil(total / pageSize),
      },
    });
  } catch (error) {
    next(error);
  }
}

async function getPublicJobById(req, res, next) {
  try {
    const job = await Job.findOne({
      _id: req.params.id,
      status: "published",
      $or: [{ expiresAt: null }, { expiresAt: { $gt: new Date() } }],
    }).lean();

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found or no longer available.",
      });
    }

    res.json({ success: true, data: job });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getPublicJobs,
  getPublicJobById,
};