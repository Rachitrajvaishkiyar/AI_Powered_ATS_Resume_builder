import { Document } from "docx";
import * as mammoth from "mammoth";
import * as fs from "fs";

export interface ParsedDocument {
  text: string;
  fileType: "pdf" | "docx" | "txt";
  numPages?: number;
}

/**
 * Parse PDF file - temporarily disabled due to library issues
 * Users can paste PDF text directly or convert to DOCX
 */
export async function parsePDF(filePath: string): Promise<ParsedDocument> {
  throw new Error("PDF parsing temporarily disabled. Please use DOCX or paste text directly.");
}

/**
 * Parse DOCX file and extract text
 */
export async function parseDOCX(filePath: string): Promise<ParsedDocument> {
  const result = await mammoth.extractRawText({ path: filePath });
  return {
    text: result.value,
    fileType: "docx"
  };
}

/**
 * Parse text file (plain text resume)
 */
export async function parseTXT(filePath: string): Promise<ParsedDocument> {
  const text = fs.readFileSync(filePath, "utf-8");
  return {
    text,
    fileType: "txt"
  };
}

/**
 * Detect file type from mimetype and parse accordingly
 */
export async function parseResumeFile(
  filePath: string,
  mimeType: string
): Promise<ParsedDocument> {
  if (mimeType === "application/pdf" || filePath.endsWith(".pdf")) {
    return parsePDF(filePath);
  }
  if (
    mimeType ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    filePath.endsWith(".docx")
  ) {
    return parseDOCX(filePath);
  }
  if (mimeType === "text/plain" || filePath.endsWith(".txt")) {
    return parseTXT(filePath);
  }
  throw new Error(`Unsupported file type: ${mimeType}`);
}
