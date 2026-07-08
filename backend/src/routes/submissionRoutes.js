const express = require("express");
const asyncHandler = require("../middleware/asyncHandler");
const {
  createSubmission,
  listSubmissions,
  getSubmissionById,
  downloadAttachment,
  deleteSubmission,
  getSubmissionStats,
} = require("../controllers/submissionController");
const { upload } = require("../middleware/upload");

const router = express.Router();

router.get("/stats", asyncHandler(getSubmissionStats));
router.get("/", asyncHandler(listSubmissions));
router.get("/:id", asyncHandler(getSubmissionById));
router.get("/:id/download", asyncHandler(downloadAttachment));
router.delete("/:id", asyncHandler(deleteSubmission));
router.post("/", upload.single("attachment"), asyncHandler(createSubmission));

module.exports = router;
