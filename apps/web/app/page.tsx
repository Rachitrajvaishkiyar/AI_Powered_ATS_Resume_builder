"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, UploadCloud, Cpu, CheckCircle2, AlertTriangle, Briefcase, BarChart3, Layers } from "lucide-react";

const metrics = [
  { label: "ATS Score", value: "94", icon: BarChart3 },
  { label: "Resume Versions", value: "12", icon: Layers },
  { label: "Job Matches", value: "27", icon: Briefcase },
  { label: "Optimizations", value: "54", icon: Sparkles }
];

const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000/api/resume";

export default function Home() {
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [optimizedResume, setOptimizedResume] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploadNotice, setUploadNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setUploadNotice(null);
    setError(null);
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(`${apiBase}/parse-file`, {
        method: "POST",
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to parse file");
      }

      const data = await response.json();
      setResumeText(data.parsed.text);
      setUploadNotice(`Loaded ${file.name} • ${data.extracted.skills?.length || 0} skill matches`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload file");
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyze = async () => {
    setError(null);
    setLoading(true);
    setAnalysis(null);
    try {
      const response = await fetch(`${apiBase}/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobDescription })
      });

      if (!response.ok) throw new Error("Failed to analyze job description.");
      const data = await response.json();
      setAnalysis(data.analysis || JSON.stringify(data, null, 2));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const handleOptimize = async () => {
    setError(null);
    setLoading(true);
    setOptimizedResume(null);
    try {
      const response = await fetch(`${apiBase}/optimize`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeText, jobDescription })
      });

      if (!response.ok) throw new Error("Failed to optimize resume.");
      const data = await response.json();
      setOptimizedResume(data.optimizedResume || JSON.stringify(data, null, 2));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.12),_transparent_30%),linear-gradient(180deg,#020617_0%,#071728_100%)] px-6 py-8 text-slate-100">
      <div className="mx-auto grid max-w-7xl gap-10">
        <header className="grid gap-8 rounded-[2rem] border border-white/10 bg-slate-950/80 p-8 shadow-2xl shadow-slate-950/30 backdrop-blur-xl lg:grid-cols-[1.7fr_1fr]">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-3 rounded-full bg-cyan-500/10 px-4 py-2 text-sm font-medium text-cyan-200 ring-1 ring-cyan-400/20">
              <Sparkles className="h-4 w-4" /> ResumeAI Pro
            </div>
            <div className="space-y-4">
              <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">Build resumes that pass ATS and land interviews faster.</h1>
              <p className="max-w-3xl text-base leading-7 text-slate-300">Upload your resume, paste a target job description, and let AI optimize your skills, work history, and formatting for every application.</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {metrics.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="flex items-center gap-4 rounded-3xl border border-slate-800 bg-slate-900/90 p-5 shadow-xl shadow-slate-950/20">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-800 text-cyan-300">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.3em] text-slate-500">{item.label}</p>
                      <p className="mt-2 text-2xl font-semibold text-white">{item.value}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: "easeOut" }} className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-slate-950/90 via-slate-900/80 to-slate-950/90 p-8 shadow-2xl shadow-slate-950/30">
            <div className="space-y-6">
              <div className="rounded-[1.8rem] bg-slate-900/90 p-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-cyan-300">Live preview</p>
                    <p className="mt-2 text-3xl font-semibold text-white">AI workflow</p>
                  </div>
                  <span className="rounded-full bg-slate-800/80 px-3 py-1 text-xs uppercase tracking-[0.3em] text-slate-400">Beta</span>
                </div>
                <div className="mt-6 space-y-4">
                  <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-4">
                    <p className="text-sm text-slate-300">One-click resume analysis</p>
                    <p className="mt-2 text-white">Extract skills, identify keywords, and optimize your resume for each job posting.</p>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-4">
                      <p className="text-sm text-slate-400">ATS-ready</p>
                      <p className="mt-2 text-white">Designed to help your resume perform better in applicant tracking systems.</p>
                    </div>
                    <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-4">
                      <p className="text-sm text-slate-400">Impact-driven</p>
                      <p className="mt-2 text-white">Focuses your achievements on measurable business results.</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="rounded-[1.8rem] border border-slate-800 bg-slate-950/90 p-6">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Why ResumeAI</p>
                <h2 className="mt-3 text-2xl font-semibold text-white">Resume optimization without the guesswork.</h2>
                <p className="mt-3 text-sm leading-7 text-slate-300">Turn your experience into recruiter-ready language and make every application more effective.</p>
              </div>
            </div>
          </motion.div>
        </header>

        <section className="grid gap-6 rounded-[2rem] border border-white/10 bg-slate-950/80 p-8 shadow-2xl shadow-slate-950/20">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-[1.8rem] border border-slate-800 bg-slate-900/85 p-6">
              <p className="text-xs uppercase tracking-[0.3em] text-cyan-300">Step 1</p>
              <h3 className="mt-3 text-xl font-semibold text-white">Upload & parse</h3>
              <p className="mt-3 text-sm leading-7 text-slate-400">Add your resume file and let the app extract your experience, skills, and structure automatically.</p>
            </div>
            <div className="rounded-[1.8rem] border border-slate-800 bg-slate-900/85 p-6">
              <p className="text-xs uppercase tracking-[0.3em] text-cyan-300">Step 2</p>
              <h3 className="mt-3 text-xl font-semibold text-white">Analyze fit</h3>
              <p className="mt-3 text-sm leading-7 text-slate-400">Paste a job description and receive AI insights on keyword alignment and ATS compatibility.</p>
            </div>
            <div className="rounded-[1.8rem] border border-slate-800 bg-slate-900/85 p-6">
              <p className="text-xs uppercase tracking-[0.3em] text-cyan-300">Step 3</p>
              <h3 className="mt-3 text-xl font-semibold text-white">Optimize faster</h3>
              <p className="mt-3 text-sm leading-7 text-slate-400">Generate refined resume content with stronger wording, measurable impact, and recruiter-focused language.</p>
            </div>
          </div>
        </section>

        <section className="grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[2rem] border border-white/10 bg-slate-950/80 p-8 shadow-2xl shadow-slate-950/20">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Resume input</p>
                <h2 className="mt-2 text-3xl font-semibold text-white">Upload or paste your resume</h2>
              </div>
              <label className="inline-flex cursor-pointer items-center gap-3 rounded-full bg-slate-900/90 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
                <UploadCloud className="h-5 w-5 text-cyan-300" />
                Choose resume file
                <input type="file" accept=".docx,.txt,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain" onChange={handleFileChange} className="hidden" />
              </label>
            </div>
            <p className="mt-4 text-sm leading-7 text-slate-400">Paste your resume text or upload DOCX/TXT to extract skills, structure, and contact information instantly.</p>
            <textarea
              value={resumeText}
              onChange={(event) => setResumeText(event.target.value)}
              rows={12}
              placeholder="Paste your resume content here..."
              className="mt-6 min-h-[320px] w-full rounded-[1.8rem] border border-slate-800 bg-slate-900/85 p-5 text-sm text-slate-100 outline-none transition focus:border-cyan-400"
            />
            {uploadNotice ? (
              <div className="mt-4 inline-flex items-center gap-2 rounded-3xl bg-slate-900/80 px-4 py-3 text-sm text-slate-300">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                {uploadNotice}
              </div>
            ) : null}
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-slate-950/80 p-8 shadow-2xl shadow-slate-950/20">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Job description analyzer</p>
              <h2 className="mt-2 text-3xl font-semibold text-white">Target your application</h2>
            </div>
            <p className="mt-4 text-sm leading-7 text-slate-400">Paste the job description below and get AI-driven keyword, skills, and fit recommendations.</p>
            <textarea
              value={jobDescription}
              onChange={(event) => setJobDescription(event.target.value)}
              rows={12}
              placeholder="Paste the job description here..."
              className="mt-6 min-h-[320px] w-full rounded-[1.8rem] border border-slate-800 bg-slate-900/85 p-5 text-sm text-slate-100 outline-none transition focus:border-cyan-400"
            />
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <button
                onClick={handleAnalyze}
                disabled={loading || !jobDescription.trim()}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-cyan-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Analyze Job Description
                <ArrowRight className="h-4 w-4" />
              </button>
              <button
                onClick={handleOptimize}
                disabled={loading || !resumeText.trim() || !jobDescription.trim()}
                className="inline-flex items-center justify-center rounded-full border border-slate-700 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:border-slate-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Optimize Resume
              </button>
            </div>
            {error ? (
              <div className="mt-6 rounded-3xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-200">
                <AlertTriangle className="mr-2 inline h-4 w-4" /> {error}
              </div>
            ) : null}
            {loading ? (
              <div className="mt-6 inline-flex items-center gap-2 rounded-3xl bg-slate-900/80 px-4 py-3 text-sm text-slate-300">
                <Cpu className="h-4 w-4 animate-pulse text-cyan-300" /> AI is generating your results...
              </div>
            ) : null}
          </div>
        </section>

        <section className="grid gap-8 xl:grid-cols-2">
          <div className="rounded-[2rem] border border-white/10 bg-slate-950/80 p-8 shadow-2xl shadow-slate-950/20">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-cyan-300">AI analysis output</p>
                <h2 className="mt-2 text-3xl font-semibold text-white">Job match insights</h2>
              </div>
              <span className="rounded-full bg-slate-900/80 px-3 py-1 text-xs uppercase tracking-[0.3em] text-slate-400">ATS Focus</span>
            </div>
            <div className="mt-6 rounded-[1.8rem] border border-slate-800 bg-slate-900/85 p-6 text-sm leading-7 text-slate-300">
              <pre className="whitespace-pre-wrap break-words">{analysis ?? "Analyze a job description to see skills, keyword matches, and ATS improvement ideas."}</pre>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-slate-950/80 p-8 shadow-2xl shadow-slate-950/20">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-cyan-300">Optimized resume</p>
                <h2 className="mt-2 text-3xl font-semibold text-white">AI-generated resume content</h2>
              </div>
              <span className="rounded-full bg-slate-900/80 px-3 py-1 text-xs uppercase tracking-[0.3em] text-slate-400">Impact first</span>
            </div>
            <div className="mt-6 rounded-[1.8rem] border border-slate-800 bg-slate-900/85 p-6 text-sm leading-7 text-slate-300">
              <pre className="whitespace-pre-wrap break-words">{optimizedResume ?? "Once you optimize, the rewritten resume will appear here with stronger action verbs and ATS-friendly keywords."}</pre>
            </div>
          </div>
        </section>

        <section className="grid gap-6 rounded-[2rem] border border-white/10 bg-slate-950/80 p-8 shadow-2xl shadow-slate-950/20">
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="rounded-[1.8rem] border border-slate-800 bg-slate-900/85 p-6">
              <p className="text-xs uppercase tracking-[0.3em] text-cyan-300">Feature</p>
              <h3 className="mt-3 text-xl font-semibold text-white">Instant skill matching</h3>
              <p className="mt-3 text-sm leading-7 text-slate-400">Identify the keywords, skills, and certifications recruiters expect for your target role.</p>
            </div>
            <div className="rounded-[1.8rem] border border-slate-800 bg-slate-900/85 p-6">
              <p className="text-xs uppercase tracking-[0.3em] text-cyan-300">Feature</p>
              <h3 className="mt-3 text-xl font-semibold text-white">ATS-friendly formatting</h3>
              <p className="mt-3 text-sm leading-7 text-slate-400">Reword bullet points and structure your resume to avoid parsing issues and preserve readability.</p>
            </div>
            <div className="rounded-[1.8rem] border border-slate-800 bg-slate-900/85 p-6">
              <p className="text-xs uppercase tracking-[0.3em] text-cyan-300">Feature</p>
              <h3 className="mt-3 text-xl font-semibold text-white">Targeted recommendations</h3>
              <p className="mt-3 text-sm leading-7 text-slate-400">Get job-specific suggestions for your resume based on the exact description you pasted.</p>
            </div>
          </div>

          <footer className="mt-8 flex flex-col gap-4 border-t border-slate-800 pt-6 text-slate-400 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm">ResumeAI Pro helps professionals move from application to interview-ready faster.</p>
            <div className="flex flex-wrap items-center gap-3 text-sm text-slate-300">
              <span className="rounded-full bg-slate-900/80 px-3 py-2">ATS Optimization</span>
              <span className="rounded-full bg-slate-900/80 px-3 py-2">AI-generated content</span>
              <span className="rounded-full bg-slate-900/80 px-3 py-2">Job-specific fit</span>
            </div>
          </footer>
        </section>
      </div>
    </main>
  );
}
