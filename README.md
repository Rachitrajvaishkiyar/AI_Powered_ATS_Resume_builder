# ResumeAI Pro

Enterprise-grade SaaS web application scaffold for an AI-powered ATS resume builder.

## Workspace structure

- `apps/web` - Next.js 15 / React 19 frontend
- `apps/api` - Express backend with AI, ATS scoring, and resume endpoints

## Quick start

```bash
npm install
npm run dev:web
npm run dev:api
```

## Features

- Resume upload + job description analysis
- AI-powered resume optimization
- ATS scoring and missing keyword suggestions
- Export-ready resume templates

## Environment

Copy `.env.example` to `.env` in `apps/api` and configure your OpenAI and database credentials.
