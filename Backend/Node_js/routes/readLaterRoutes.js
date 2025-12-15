const express = require("express");
const router = express.Router();

const ReadLater = require("../models/ReadLater");

// -------------------------------------------
// ADD to Read Later
// -------------------------------------------
router.post("/", async (req, res) => {
  try {
    const { user_id, article_id } = req.body;

    if (!user_id || !article_id) {
      return res.status(400).json({ message: "user_id and article_id required" });
    }

    // prevent duplicate
    const exists = await ReadLater.findOne({
      where: { user_id, article_id }
    });

    if (exists) {
      return res.status(409).json({ message: "Already added to Read Later" });
    }

    const saved = await ReadLater.create({
      user_id,
      article_id
    });

    res.status(201).json({
      message: "Added to Read Later",
      data: saved
    });

  } catch (err) {
    console.error("Error adding to Read Later:", err);
    res.status(500).json({ message: "Server error", error: err });
  }
});

// -------------------------------------------
// GET Read Later list for a user
// -------------------------------------------
router.get("/:user_id", async (req, res) => {
  try {
    const { user_id } = req.params;

    const list = await ReadLater.findAll({
      where: { user_id }
    });

    res.json(list);

  } catch (err) {
    console.error("Error fetching Read Later list:", err);
    res.status(500).json({ message: "Server error", error: err });
  }
});

// -------------------------------------------
// DELETE (remove) from Read Later
// -------------------------------------------
router.delete("/", async (req, res) => {
  try {
    const { user_id, article_id } = req.body;

    const removed = await ReadLater.destroy({
      where: { user_id, article_id }
    });

    if (!removed) {
      return res.status(404).json({ message: "Not found in Read Later" });
    }

    res.json({ message: "Removed from Read Later" });

  } catch (err) {
    console.error("Error removing from Read Later:", err);
    res.status(500).json({ message: "Server error", error: err });
  }
});

module.exports = router;
