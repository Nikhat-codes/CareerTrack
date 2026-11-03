"use strict";

const express = require("express");
const {
  getPublicJobs,
  getPublicJobById,
} = require("../controllers/jobController");

const router = express.Router();

router.get("/", getPublicJobs);
router.get("/:id", getPublicJobById);

module.exports = router;