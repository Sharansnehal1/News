const express = require("express");
const router = express.Router();
const Comment = require("../models/Comment");
const auth = require("../middleware/auth");
// SAVE a comment
router.post("/save-comment", auth,async (req, res) => {
    debugger
  try {
    const { comment,Name } = req.body;
    const comments = await Comment.create({ comment,Name,userId: req.userId });
    res.json({ success: true, data: comments });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});
module.exports = router;