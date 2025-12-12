const express = require("express");
const router = express.Router();
const Note = require("../models/Note");
const auth = require("../middleware/auth");




// GET all notes
router.get("/", async (req, res) => {
  try {
    const notes = await Note.findAll({ order: [["id", "DESC"]] });
    res.json(notes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// SAVE a note
router.post("/save-notes", auth,async (req, res) => {
    debugger
  try {
    const { notes_text, canvas_image, articleId } = req.body;
    if (!articleId) {
      return res.status(400).json({ success: false, error: "articleId is required" });
    }
    const note = await Note.create({ notes_text, canvas_image, userId: req.userId,articleId });
    res.json({ success: true, data: note });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
