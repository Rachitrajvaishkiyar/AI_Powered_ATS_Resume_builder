import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import resumeRouter from "./routes/resumeRoutes";

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

app.use(cors({ origin: process.env.ALLOWED_ORIGIN || "http://localhost:3000" }));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

app.use("/api/resume", resumeRouter);

app.get("/", (_req, res) => {
  res.json({ message: "ResumeAI Pro API is running. Use /api/resume/* endpoints or /api/health." });
});

app.get("/api/health", (_req, res) => res.json({ status: "ok" }));

app.listen(port, () => {
  console.log(`ResumeAI Pro API listening on port ${port}`);
});
