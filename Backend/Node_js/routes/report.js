const express = require("express");
const router = express.Router();

const Report = require("../models/Report");

// -------------------------------------------
// REPORT an article
// -------------------------------------------
router.post("/", async (req, res) => {
  try {
    const { user_id, article_id, reason } = req.body;

    if (!user_id || !article_id) {
      return res.status(400).json({
        message: "user_id and article_id are required"
      });
    }

    // Create report
    const report = await Report.create({
      user_id,
      article_id,
      reason: reason || null
    });

    return res.status(201).json({
      message: "Article reported successfully",
      data: report
    });

  } catch (err) {
    console.error("Error reporting article:", err);
    return res.status(500).json({
      message: "Server error",
      error: err
    });
  }
});

// -------------------------------------------
// GET all reports (for admin or dashboard)
// -------------------------------------------
router.get("/", async (req, res) => {
  try {
    const reports = await Report.findAll();
    return res.json(reports);
  } catch (err) {
    console.error("Error fetching reports:", err);
    return res.status(500).json({
      message: "Server error",
      error: err
    });
  }
});

// -------------------------------------------
// DELETE a specific report (optional)
// -------------------------------------------
router.delete("/", async (req, res) => {
  try {
    const { user_id, article_id } = req.body;

    const deleted = await Report.destroy({
      where: { user_id, article_id }
    });

    if (!deleted) {
      return res.status(404).json({ message: "Report not found" });
    }

    return res.json({ message: "Report deleted successfully" });

  } catch (err) {
    console.error("Error deleting report:", err);
    return res.status(500).json({
      message: "Server error",
      error: err
    });
  }
});

module.exports = router;
