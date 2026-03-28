export type CapabilityLane =
  | "Product Engineering"
  | "AI Systems"
  | "Practical Tools";

export type DataSource = "live" | "snapshot";

export type ContactLink = {
  label: string;
  href: string;
  note: string;
};

export type GitHubProfile = {
  name: string;
  bio: string;
  location: string;
  blogUrl: string | null;
  githubUrl: string;
  readmeUrl: string;
};

export type GitHubRepoSummary = {
  name: string;
  slug: string;
  description: string | null;
  language: string | null;
  homepage: string | null;
  repoUrl: string;
  readmeUrl: string | null;
  updatedAt: string;
  readmeExcerpt: string | null;
  automatedLane?: CapabilityLane | null;
  automatedFraming?: string | null;
  automatedNote?: string | null;
};

export type ProjectVisual = {
  src: string;
  alt: string;
};

export type ProjectDossier = GitHubRepoSummary & {
  lane: CapabilityLane;
  framing: string;
  note: string;
  proof: string[];
  problem?: string | null;
  built?: string | null;
  visual?: ProjectVisual | null;
};

export type PortfolioData = {
  source: DataSource;
  profile: GitHubProfile;
  featured: ProjectDossier[];
  archive: GitHubRepoSummary[];
  repoCount: number;
  recentUpdatedAt: string;
  contactLinks: ContactLink[];
};

export type CuratedRepoConfig = {
  lane: CapabilityLane;
  framing: string;
  note: string;
  problem?: string;
  built?: string;
};

export const SITE_NAME = "Rohith B | Build Ledger";
export const SITE_URL = "https://profile-website-indol-nine.vercel.app";
export const GITHUB_OWNER = "Rohith-AI-HUB";

export const FEATURED_REPO_ORDER = [
  "personal-canvas",
  "proposal-generator",
  "Task_Scheduling_Agent_V2",
  "ai-paper-explainer",
  "QR_Generator",
  "PhysioNetSepsisPrediction",
] as const;

export const PROJECT_VISUALS: Partial<Record<string, ProjectVisual>> = {
  "personal-canvas": {
    src: "/project-visuals/personal-canvas.png",
    alt: "Screenshot of the Personal Canvas desktop workspace with folder cards and local search.",
  },
  "proposal-generator": {
    src: "/project-visuals/proposal-generator.png",
    alt: "Screenshot of the Proposal Generator landing page and proposal builder.",
  },
  Task_Scheduling_Agent_V2: {
    src: "/project-visuals/task-scheduling-agent-v2.png",
    alt: "Screenshot of the Task Scheduling Agent sign-in screen.",
  },
  "ai-paper-explainer": {
    src: "/project-visuals/ai-paper-explainer.png",
    alt: "Screenshot of the AI Paper Explainer landing page and feature previews.",
  },
  QR_Generator: {
    src: "/project-visuals/qr-generator.png",
    alt: "Screenshot of the QR Generator after rendering downloadable QR codes.",
  },
  PhysioNetSepsisPrediction: {
    src: "/project-visuals/physionet-sepsis-prediction.png",
    alt: "Screenshot of the PhysioNet sepsis notebook showing the ROC curve output.",
  },
};

export const CURATED_REPOS: Record<string, CuratedRepoConfig> = {
  "personal-canvas": {
    lane: "Product Engineering",
    framing:
      "Local-first knowledge canvas for files, search, and chat workflows.",
    note:
      "Desktop canvas with folder cards, local search, export, and AI chat.",
    problem:
      "Knowledge work gets fragmented across files, notes, and chat tools that do not share context.",
    built:
      "Local-first desktop app for browsing folders, searching content, exporting notes, and chatting with personal data.",
  },
  "proposal-generator": {
    lane: "Practical Tools",
    framing:
      "Proposal drafting workflow for turning a job post and proof pack into a usable first draft.",
    note:
      "Landing page and builder for turning an Upwork job post into a reply-ready proposal.",
    problem:
      "Proposal writing repeats the same positioning work every time a new application starts.",
    built:
      "Browser-based workflow that matches a job post with saved proof points and returns a quick reply or a fuller proposal draft.",
  },
  Task_Scheduling_Agent_V2: {
    lane: "AI Systems",
    framing:
      "AI-enhanced classroom management system for scheduling, grouping, evaluation, and student support.",
    note:
      "Sign-in surface for the classroom management app with scheduling and evaluation workflows behind it.",
    problem:
      "Class scheduling, grouping, and evaluation break down when the workflow stays manual.",
    built:
      "Classroom management platform with AI-assisted scheduling, grouping, extensions, and evaluation flows.",
  },
  "ai-paper-explainer": {
    lane: "AI Systems",
    framing:
      "Paper analysis workflow that turns a PDF into structured summaries, concepts, and study prompts.",
    note:
      "Upload flow and results views for summaries, key concepts, formulas, and exam questions.",
    problem:
      "Research papers are slow to parse when the useful output is buried inside dense PDFs.",
    built:
      "Upload-driven explainer that returns summaries, plain-language breakdowns, key concepts, formulas, and study questions.",
  },
  PhysioNetSepsisPrediction: {
    lane: "AI Systems",
    framing:
      "Machine learning workflow for early sepsis risk detection from ICU data.",
    note:
      "Notebook pipeline with ROC output and risk-level predictions from ICU data.",
    problem:
      "Sepsis risk is time-sensitive and hard to identify early from raw ICU measurements alone.",
    built:
      "Machine-learning pipeline that aggregates ICU signals, predicts sepsis risk, and compares model performance.",
  },
  QR_Generator: {
    lane: "Practical Tools",
    framing:
      "Small utility for turning URLs into QR outputs at multiple sizes.",
    note:
      "Single-input generator that renders download-ready QR codes in three sizes.",
    problem:
      "Generating a clean QR code for a link should not require a design tool or a bloated workflow.",
    built:
      "Small web utility that takes one URL or text input and generates downloadable QR outputs at multiple sizes.",
  },
};

export const CONTACT_LINKS: ContactLink[] = [
  {
    label: "GitHub",
    href: "https://github.com/Rohith-AI-HUB",
    note: "Primary public work log and code trail",
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/rohith-b-04082003rb/",
    note: "Professional background and experience",
  },
  {
    label: "Email",
    href: "mailto:rohithb892@gmail.com",
    note: "Direct contact for roles and project work",
  },
];

export const SNAPSHOT_PORTFOLIO: PortfolioData = {
  source: "snapshot",
  profile: {
    name: "Rohith.B",
    bio:
      "I'm a full-stack developer passionate about building efficient, user-focused web applications using modern frameworks, clean code practices.",
    location: "Bengaluru, India",
    blogUrl: "https://portfolio-murex-rho-39.vercel.app/",
    githubUrl: "https://github.com/Rohith-AI-HUB",
    readmeUrl: "https://github.com/Rohith-AI-HUB/Rohith-AI-HUB#readme",
  },
  featured: [
    {
      name: "personal-canvas",
      slug: "personal-canvas",
      description: null,
      language: "TypeScript",
      homepage: null,
      repoUrl: "https://github.com/Rohith-AI-HUB/personal-canvas",
      readmeUrl: "https://github.com/Rohith-AI-HUB/personal-canvas/blob/main/README.md",
      updatedAt: "2026-03-13T13:22:36Z",
      readmeExcerpt:
        "A local-first desktop knowledge canvas for organizing files, searching content, and chatting with your data.",
      lane: "Product Engineering",
      framing:
        "Local-first knowledge canvas for files, search, and chat workflows.",
      note:
        "Desktop canvas with folder cards, local search, export, and AI chat.",
      proof: ["TypeScript", "README-backed", "Updated Mar 2026"],
      problem:
        "Knowledge work gets fragmented across files, notes, and chat tools that do not share context.",
      built:
        "Local-first desktop app for browsing folders, searching content, exporting notes, and chatting with personal data.",
      visual: PROJECT_VISUALS["personal-canvas"],
    },
    {
      name: "proposal-generator",
      slug: "proposal-generator",
      description: null,
      language: "TypeScript",
      homepage: "https://proposal-generator-blond.vercel.app",
      repoUrl: "https://github.com/Rohith-AI-HUB/proposal-generator",
      readmeUrl: "https://github.com/Rohith-AI-HUB/proposal-generator/blob/main/README.md",
      updatedAt: "2026-03-27T04:10:56Z",
      readmeExcerpt:
        "Paste an Upwork job post and get a short, job-specific proposal built from a reusable proof pack.",
      lane: "Practical Tools",
      framing:
        "Proposal drafting workflow for turning a job post and proof pack into a usable first draft.",
      note:
        "Landing page and builder for turning an Upwork job post into a reply-ready proposal.",
      proof: ["TypeScript", "Live demo", "Updated Mar 2026"],
      problem:
        "Proposal writing repeats the same positioning work every time a new application starts.",
      built:
        "Browser-based workflow that matches a job post with saved proof points and returns a quick reply or a fuller proposal draft.",
      visual: PROJECT_VISUALS["proposal-generator"],
    },
    {
      name: "Task_Scheduling_Agent_V2",
      slug: "Task_Scheduling_Agent_V2",
      description: null,
      language: "Python",
      homepage: "https://task-scheduling-agent-v2.vercel.app",
      repoUrl:
        "https://github.com/Rohith-AI-HUB/Task_Scheduling_Agent_V2",
      readmeUrl:
        "https://github.com/Rohith-AI-HUB/Task_Scheduling_Agent_V2/blob/main/README.md",
      updatedAt: "2026-02-28T15:50:41Z",
      readmeExcerpt:
        "A production-ready intelligent classroom management platform that combines traditional task management with AI-powered features for scheduling, grouping, evaluation, and student support.",
      lane: "AI Systems",
      framing:
        "AI-enhanced classroom management system for scheduling, grouping, evaluation, and student support.",
      note:
        "Sign-in surface for the classroom management app with scheduling and evaluation workflows behind it.",
      proof: ["Python", "Live demo", "Updated Feb 2026"],
      problem:
        "Class scheduling, grouping, and evaluation break down when the workflow stays manual.",
      built:
        "Classroom management platform with AI-assisted scheduling, grouping, extensions, and evaluation flows.",
      visual: PROJECT_VISUALS.Task_Scheduling_Agent_V2,
    },
    {
      name: "ai-paper-explainer",
      slug: "ai-paper-explainer",
      description: null,
      language: "TypeScript",
      homepage: "https://ai-paper-explainer-sigma.vercel.app",
      repoUrl:
        "https://github.com/Rohith-AI-HUB/ai-paper-explainer",
      readmeUrl:
        "https://github.com/Rohith-AI-HUB/ai-paper-explainer/blob/master/README.md",
      updatedAt: "2026-03-26T14:47:32Z",
      readmeExcerpt:
        "Upload a research paper PDF and get a summary, plain-language explanation, key concepts, formulas, and exam questions.",
      lane: "AI Systems",
      framing:
        "Paper analysis workflow that turns a PDF into structured summaries, concepts, and study prompts.",
      note:
        "Upload flow and results views for summaries, key concepts, formulas, and exam questions.",
      proof: ["TypeScript", "Live demo", "Updated Mar 2026"],
      problem:
        "Research papers are slow to parse when the useful output is buried inside dense PDFs.",
      built:
        "Upload-driven explainer that returns summaries, plain-language breakdowns, key concepts, formulas, and study questions.",
      visual: PROJECT_VISUALS["ai-paper-explainer"],
    },
    {
      name: "QR_Generator",
      slug: "QR_Generator",
      description: null,
      language: "JavaScript",
      homepage: "https://qr-generator-indol-one.vercel.app/",
      repoUrl: "https://github.com/Rohith-AI-HUB/QR_Generator",
      readmeUrl: "https://github.com/Rohith-AI-HUB/QR_Generator/blob/main/README.md",
      updatedAt: "2026-03-26T14:51:31Z",
      readmeExcerpt:
        "A simple and elegant QR code generator that creates QR codes in three different sizes from any website URL.",
      lane: "Practical Tools",
      framing:
        "Small utility for turning URLs into QR outputs at multiple sizes.",
      note:
        "Single-input generator that renders download-ready QR codes in three sizes.",
      proof: ["JavaScript", "Live demo", "Updated Mar 2026"],
      problem:
        "Generating a clean QR code for a link should not require a design tool or a bloated workflow.",
      built:
        "Small web utility that takes one URL or text input and generates downloadable QR outputs at multiple sizes.",
      visual: PROJECT_VISUALS.QR_Generator,
    },
    {
      name: "PhysioNetSepsisPrediction",
      slug: "PhysioNetSepsisPrediction",
      description: null,
      language: "Jupyter Notebook",
      homepage: null,
      repoUrl:
        "https://github.com/Rohith-AI-HUB/PhysioNetSepsisPrediction",
      readmeUrl:
        "https://github.com/Rohith-AI-HUB/PhysioNetSepsisPrediction/blob/main/README.md",
      updatedAt: "2026-02-16T06:36:35Z",
      readmeExcerpt:
        "Machine learning system for predicting sepsis risk in ICU patients from vital signs and clinical measurements.",
      lane: "AI Systems",
      framing:
        "Machine learning workflow for early sepsis risk detection from ICU data.",
      note:
        "Notebook pipeline with ROC output and risk-level predictions from ICU data.",
      proof: ["Jupyter Notebook", "README-backed", "Updated Feb 2026"],
      problem:
        "Sepsis risk is time-sensitive and hard to identify early from raw ICU measurements alone.",
      built:
        "Machine-learning pipeline that aggregates ICU signals, predicts sepsis risk, and compares model performance.",
      visual: PROJECT_VISUALS.PhysioNetSepsisPrediction,
    },
  ],
  archive: [
    {
      name: "Marketing",
      slug: "Marketing",
      description: null,
      language: "HTML",
      homepage: "https://proposaliq-ten.vercel.app",
      repoUrl: "https://github.com/Rohith-AI-HUB/Marketing",
      readmeUrl: null,
      updatedAt: "2026-03-24T04:40:41Z",
      readmeExcerpt: null,
    },
    {
      name: "Canvascape",
      slug: "Canvascape",
      description: null,
      language: "JavaScript",
      homepage: null,
      repoUrl: "https://github.com/Rohith-AI-HUB/Canvascape",
      readmeUrl: null,
      updatedAt: "2026-03-02T16:46:10Z",
      readmeExcerpt: null,
    },
    {
      name: "Adaptive_Course_Planning_System",
      slug: "Adaptive_Course_Planning_System",
      description: null,
      language: "Python",
      homepage: null,
      repoUrl:
        "https://github.com/Rohith-AI-HUB/Adaptive_Course_Planning_System",
      readmeUrl:
        "https://github.com/Rohith-AI-HUB/Adaptive_Course_Planning_System#readme",
      updatedAt: "2026-02-17T05:35:21Z",
      readmeExcerpt:
        "The Adaptive Course Planning System is an intelligent recommendation engine for university students.",
    },
    {
      name: "Calculator",
      slug: "Calculator",
      description: null,
      language: "HTML",
      homepage: null,
      repoUrl: "https://github.com/Rohith-AI-HUB/Calculator",
      readmeUrl: null,
      updatedAt: "2026-02-14T15:04:54Z",
      readmeExcerpt: null,
    },
    {
      name: "aci_project",
      slug: "aci_project",
      description: null,
      language: "Python",
      homepage: null,
      repoUrl: "https://github.com/Rohith-AI-HUB/aci_project",
      readmeUrl: null,
      updatedAt: "2026-02-10T00:34:02Z",
      readmeExcerpt: null,
    },
    {
      name: "Task_Scheduling_Agent1",
      slug: "Task_Scheduling_Agent1",
      description: null,
      language: "JavaScript",
      homepage: null,
      repoUrl: "https://github.com/Rohith-AI-HUB/Task_Scheduling_Agent1",
      readmeUrl: null,
      updatedAt: "2026-01-17T13:09:35Z",
      readmeExcerpt: null,
    },
    {
      name: "Feedback-APP",
      slug: "Feedback-APP",
      description: null,
      language: "JavaScript",
      homepage: "https://feedback-app-frontend-izsr.vercel.app",
      repoUrl: "https://github.com/Rohith-AI-HUB/Feedback-APP",
      readmeUrl: "https://github.com/Rohith-AI-HUB/Feedback-APP#readme",
      updatedAt: "2025-02-19T05:42:32Z",
      readmeExcerpt:
        "Feedback App is a full-stack web application that allows users to submit and manage feedback.",
    },
    {
      name: "S.P.E.A.R",
      slug: "S.P.E.A.R",
      description: null,
      language: "JavaScript",
      homepage: null,
      repoUrl: "https://github.com/Rohith-AI-HUB/S.P.E.A.R",
      readmeUrl: null,
      updatedAt: "2025-04-07T12:38:27Z",
      readmeExcerpt: null,
    },
    {
      name: "Zenith-AI",
      slug: "Zenith-AI",
      description: null,
      language: null,
      homepage: null,
      repoUrl: "https://github.com/Rohith-AI-HUB/Zenith-AI",
      readmeUrl: null,
      updatedAt: "2024-11-18T12:25:30Z",
      readmeExcerpt: null,
    },
  ],
  repoCount: 22,
  recentUpdatedAt: "2026-03-27T04:10:56Z",
  contactLinks: CONTACT_LINKS,
};
