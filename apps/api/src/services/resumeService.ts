import { OpenAI } from "openai";

function getOpenAIClient() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey || apiKey.trim() === "" || apiKey.startsWith("your-")) {
    throw new Error("OpenAI API key is not configured. Set OPENAI_API_KEY in apps/api/.env.");
  }
  return new OpenAI({ apiKey });
}

export async function analyzeJobDescription(payload: { jobDescription: string }) {
  const prompt = `Analyze the following job description and provide JSON with top required skills, missing skills, keyword density, experience expectations, seniority level detection, ATS match score, resume improvement suggestions, strengths, and weaknesses.\n\nJob Description:\n${payload.jobDescription}`;

  const client = getOpenAIClient();
  const response = await client.responses.create({
    model: "gpt-4.1-mini",
    input: prompt,
    temperature: 0.2,
    max_output_tokens: 800
  });

  const text = response.output_text;
  return { analysis: text };
}

export async function optimizeResume(payload: { resumeText: string; jobDescription: string }) {
  const prompt = `Given the resume text and target job description, rewrite the resume using powerful action verbs, quantifiable achievements, ATS-friendly language, and matching keywords. Output the optimized resume text only.\n\nJob Description:\n${payload.jobDescription}\n\nResume Text:\n${payload.resumeText}`;

  const client = getOpenAIClient();
  const response = await client.responses.create({
    model: "gpt-4.1-mini",
    input: prompt,
    temperature: 0.3,
    max_output_tokens: 900
  });

  return { optimizedResume: response.output_text };
}

export async function generateCoverLetter(payload: { resumeText: string; jobDescription: string; companyName: string; industry: string }) {
  const prompt = `Write a professional cover letter for the following company and industry. Use the resume text and job description to explain why the candidate is a strong fit.\n\nCompany: ${payload.companyName}\nIndustry: ${payload.industry}\n\nJob Description:\n${payload.jobDescription}\n\nResume Text:\n${payload.resumeText}`;

  const client = getOpenAIClient();
  const response = await client.responses.create({
    model: "gpt-4.1-mini",
    input: prompt,
    temperature: 0.4,
    max_output_tokens: 800
  });

  return { coverLetter: response.output_text };
}
