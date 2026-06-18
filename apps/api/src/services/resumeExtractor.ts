/**
 * Resume extraction and structure parsing
 */

export interface ExtractedResume {
  fullText: string;
  contact?: {
    email?: string;
    phone?: string;
    linkedin?: string;
    website?: string;
  };
  summary?: string;
  skills?: string[];
  experience?: ExperienceItem[];
  education?: EducationItem[];
  certifications?: string[];
  keywords?: string[];
}

export interface ExperienceItem {
  title?: string;
  company?: string;
  duration?: string;
  description?: string;
}

export interface EducationItem {
  degree?: string;
  institution?: string;
  year?: string;
  details?: string;
}

/**
 * Extract email from resume text
 */
function extractEmail(text: string): string | undefined {
  const emailMatch = text.match(/[\w\.-]+@[\w\.-]+\.\w+/);
  return emailMatch?.[0];
}

/**
 * Extract phone from resume text
 */
function extractPhone(text: string): string | undefined {
  const phoneMatch = text.match(
    /(\+?1?\s*)?(\d{3}[-.\s]?)?\d{3}[-.\s]?\d{4}/
  );
  return phoneMatch?.[0];
}

/**
 * Extract LinkedIn URL
 */
function extractLinkedIn(text: string): string | undefined {
  const linkedinMatch = text.match(
    /https?:\/\/(www\.)?linkedin\.com\/in\/[\w-]+/i
  );
  return linkedinMatch?.[0];
}

/**
 * Extract skills from text (simple pattern matching)
 */
function extractSkills(text: string): string[] {
  const commonSkills = [
    "react",
    "nodejs",
    "node.js",
    "python",
    "javascript",
    "typescript",
    "aws",
    "docker",
    "kubernetes",
    "sql",
    "mongodb",
    "postgresql",
    "restapi",
    "graphql",
    "html",
    "css",
    "tailwind",
    "next.js",
    "vue",
    "angular",
    "git",
    "ci/cd",
    "agile",
    "scrum",
    "lean",
    "communication",
    "leadership",
    "problem-solving"
  ];

  const textLower = text.toLowerCase();
  const found = commonSkills.filter((skill) => textLower.includes(skill));
  return [...new Set(found)]; // deduplicate
}

/**
 * Extract sections from resume text (simple heuristics)
 */
function extractSections(text: string): Record<string, string> {
  const sections: Record<string, string> = {};
  const sectionPatterns = {
    summary: /(?:summary|profile|objective)(.*?)(?=experience|education|skills|certification|$)/is,
    experience: /(?:experience|employment|work)(.*?)(?=education|skills|certification|$)/is,
    education: /(?:education|academic)(.*?)(?=experience|skills|certification|$)/is,
    skills: /(?:skills|technical|competencies)(.*?)(?=experience|education|certification|$)/is,
    certifications: /(?:certification|certifications|licenses)(.*?)(?=experience|education|skills|$)/is
  };

  for (const [key, pattern] of Object.entries(sectionPatterns)) {
    const match = text.match(pattern);
    if (match) {
      sections[key] = match[1].trim().substring(0, 500);
    }
  }

  return sections;
}

/**
 * Main resume extraction function
 */
export function extractResumeData(resumeText: string): ExtractedResume {
  const sections = extractSections(resumeText);

  return {
    fullText: resumeText,
    contact: {
      email: extractEmail(resumeText),
      phone: extractPhone(resumeText),
      linkedin: extractLinkedIn(resumeText),
      website: undefined // could be extracted with more patterns
    },
    summary: sections.summary || undefined,
    skills: extractSkills(resumeText),
    experience: [],
    education: [],
    certifications: [],
    keywords: extractSkills(resumeText)
  };
}
