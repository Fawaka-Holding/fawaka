const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const mongoose = require("mongoose");

const router = express.Router();

// Define MongoDB Schema for Documents
const documentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  filename: { type: String, required: true },
  filePath: { type: String, required: true },
  status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
  uploadedAt: { type: Date, default: Date.now },
});

const Document = mongoose.model("Document", documentSchema);

// 📌 Set up Multer for File Uploads (Restrict File Types)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = "uploads/";
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath);
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedExtensions = [".pdf", ".jpg", ".jpeg", ".png", ".docx"];
    const ext = path.extname(file.originalname).toLowerCase();
    if (!allowedExtensions.includes(ext)) {
      return cb(new Error("File type not allowed"), false);
    }
    cb(null, true);
  },
  limits: { fileSize: 5 * 1024 * 1024 }, // Max file size: 5MB
});

/**
 * 📌 Upload a Document
 */
router.post("/upload", upload.single("document"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const newDocument = new Document({
      userId: req.body.userId, // Ensure userId is sent in the request
      filename: req.file.filename,
      filePath: req.file.path,
    });

    await newDocument.save();
    res.json({ message: "Document uploaded successfully, pending admin approval" });
  } catch (error) {
    console.error("Upload Error:", error);
    res.status(500).json({ error: "Failed to upload document" });
  }
});

/**
 * 📌 List All User Documents (For Admin)
 */
router.get("/all", async (req, res) => {
  try {
    const documents = await Document.find();
    res.json(documents);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve documents" });
  }
});

/**
 * 📌 Approve or Reject a Document (Admin Only)
 */
router.put("/review/:id", async (req, res) => {
  try {
    const { status } = req.body;
    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const document = await Document.findByIdAndUpdate(req.params.id, { status }, { new: true });

    if (!document) {
      return res.status(404).json({ error: "Document not found" });
    }

    res.json({ message: `Document ${status} successfully`, document });
  } catch (error) {
    res.status(500).json({ error: "Failed to update document status" });
  }
});

/**
 * 📌 Download an Approved Document
 */
router.get("/download/:id", async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);
    if (!document || document.status !== "approved") {
      return res.status(403).json({ error: "Document not available for download" });
    }

    res.download(document.filePath, document.filename);
  } catch (error) {
    res.status(500).json({ error: "Failed to download document" });
  }
});

module.exports = router;
