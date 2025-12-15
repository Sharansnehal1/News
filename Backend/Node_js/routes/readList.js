const express = require("express");
const router = express.Router();

const ReadList = require("../models/ReadList");
const User = require("../models/User"); // only if you want validation

// ------------------------------------
// ADD to ReadList
// ------------------------------------
router.post("/", async (req, res) => {
  try {
    const { user_id, article_id } = req.body;

    if (!user_id || !article_id) {
      return res.status(400).json({ message: "user_id and article_id are required" });
    }

    // Check if already saved
    const exists = await ReadList.findOne({
      where: { user_id, article_id }
    });

    if (exists) {
      return res.status(409).json({ message: "Article already in ReadList" });
    }

    const saved = await ReadList.create({ user_id, article_id });

    res.status(201).json({
      message: "Article added to ReadList",
      data: saved
    });

  } catch (error) {
    console.error("Error adding to ReadList:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

// ------------------------------------
// GET all ReadList articles for a user
// ------------------------------------
router.get("/:user_id", async (req, res) => {
  try {
    const { user_id } = req.params;

    const list = await ReadList.findAll({
      where: { user_id },
      order: [["createdAt", "DESC"]] // newest first
    });

    res.json(list);
  } catch (error) {
    console.error("Error fetching ReadList:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

// ------------------------------------
// REMOVE an article from ReadList
// ------------------------------------
router.delete("/", async (req, res) => {
  try {
    const { user_id, article_id } = req.body;

    const removed = await ReadList.destroy({
      where: { user_id, article_id }
    });

    if (!removed) {
      return res.status(404).json({ message: "ReadList item not found" });
    }

    res.json({ message: "Removed from ReadList" });

  } catch (error) {
    console.error("Error removing from ReadList:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

module.exports = router;
