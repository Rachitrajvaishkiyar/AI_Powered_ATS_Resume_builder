import { Router } from "express";
import multer from "multer";
import { analyzeJobDescription, optimizeResume, generateCoverLetter } from "../services/resumeService";
import { parseResumeFile } from "../services/fileParser";
import { extractResumeData } from "../services/resumeExtractor";
import * as path from "path";
import * as fs from "fs";

const router = Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, "../../uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain"
    ];
    if (allowedMimes.includes(file.mimetype) || [".pdf", ".docx", ".txt"].includes(path.extname(file.originalname).toLowerCase())) {
      cb(null, true);
    } else {
      cb(new Error("Unsupported file type. Please upload PDF, DOCX, or TXT."));
    }
  }
});

router.post("/analyze", async (req, res) => {
  try {
    const payload = req.body;
    const result = await analyzeJobDescription(payload);
    res.json(result);
  } catch (error) {
    console.error(error);
    const message = error instanceof Error ? error.message : "Failed to analyze job description.";
    res.status(500).json({ error: process.env.NODE_ENV !== "production" ? message : "Failed to analyze job description." });
  }
});

router.post("/optimize", async (req, res) => {
  try {
    const payload = req.body;
    const result = await optimizeResume(payload);
    res.json(result);
  } catch (error) {
    console.error(error);
    const message = error instanceof Error ? error.message : "Failed to optimize resume.";
    res.status(500).json({ error: process.env.NODE_ENV !== "production" ? message : "Failed to optimize resume." });
  }
});

router.post("/cover-letter", async (req, res) => {
  try {
    const payload = req.body;
    const result = await generateCoverLetter(payload);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create cover letter." });
  }
});

/**
 * Parse resume file (PDF, DOCX, or TXT)
 */
router.post("/parse-file", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file provided" });
    }

    const filePath = req.file.path;
    const mimeType = req.file.mimetype;

    // Parse the file
    const parsed = await parseResumeFile(filePath, mimeType);

    // Extract resume data
    const extracted = extractResumeData(parsed.text);

    // Clean up the uploaded file
    fs.unlinkSync(filePath);

    res.json({
      success: true,
      parsed: {
        text: parsed.text,
        fileType: parsed.fileType,
        numPages: parsed.numPages
      },
      extracted
    });
  } catch (error) {
    console.error(error);
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ error: error instanceof Error ? error.message : "Failed to parse file" });
  }
});

export default router;
