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

export type ProjectDossier = GitHubRepoSummary & {
  lane: CapabilityLane;
  framing: string;
  note: string;
  proof: string[];
};

export type CapabilitySummary = {
  name: CapabilityLane;
  summary: string;
};

export type PortfolioData = {
  source: DataSource;
  profile: GitHubProfile;
  featured: ProjectDossier[];
  archive: GitHubRepoSummary[];
  repoCount: number;
  recentUpdatedAt: string;
  contactLinks: ContactLink[];
  capabilitySummaries: CapabilitySummary[];
};

export type CuratedRepoConfig = {
  lane: CapabilityLane;
  framing: string;
  note: string;
};

export const GITHUB_OWNER = "Rohith-AI-HUB";

export const FEATURED_REPO_ORDER = [
  "personal-canvas",
  "Task_Scheduling_Agent_V2",
  "Adaptive_Course_Planning_System",
  "PhysioNetSepsisPrediction",
  "Feedback-APP",
  "QR_Generator",
] as const;

export const CURATED_REPOS: Record<string, CuratedRepoConfig> = {
  "personal-canvas": {
    lane: "Product Engineering",
    framing:
      "Local-first knowledge canvas for files, search, and chat workflows.",
    note:
      "I am featuring this because it reads like a product surface, not a one-screen experiment.",
  },
  Task_Scheduling_Agent_V2: {
    lane: "AI Systems",
    framing:
      "AI-enhanced classroom management system for scheduling, grouping, evaluation, and student support.",
    note:
      "I am featuring this because the README defines a multi-step operating surface with clear practical scope.",
  },
  Adaptive_Course_Planning_System: {
    lane: "AI Systems",
    framing:
      "Recommendation engine aimed at university course planning and sequencing.",
    note:
      "I am featuring this because it frames AI as decision support instead of vague assistant branding.",
  },
  PhysioNetSepsisPrediction: {
    lane: "AI Systems",
    framing:
      "Machine learning workflow for early sepsis risk detection from ICU data.",
    note:
      "I am featuring this because the public description ties the model work to a concrete healthcare problem.",
  },
  "Feedback-APP": {
    lane: "Product Engineering",
    framing:
      "Full-stack feedback collection system with separated frontend and backend deployment.",
    note:
      "I am featuring this because it shows practical product wiring beyond a static marketing page.",
  },
  QR_Generator: {
    lane: "Practical Tools",
    framing:
      "Small utility for turning URLs into QR outputs at multiple sizes.",
    note:
      "I am featuring this because it is a compact, clear public tool with little narrative inflation.",
  },
};

export const CONTACT_LINKS: ContactLink[] = [
  {
    label: "GitHub",
    href: "https://github.com/Rohith-AI-HUB",
    note: "Primary public work log",
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/rohith-b-04082003rb/",
    note: "Professional profile linked from the GitHub README",
  },
  {
    label: "Email",
    href: "mailto:rohithb892@gmail.com",
    note: "Direct contact listed in the GitHub README",
  },
];

export const CAPABILITY_SUMMARIES: CapabilitySummary[] = [
  {
    name: "Product Engineering",
    summary:
      "Interfaces and workflows that look like products instead of screenshots.",
  },
  {
    name: "AI Systems",
    summary:
      "Recommendation, scheduling, and prediction work tied to specific operating problems.",
  },
  {
    name: "Practical Tools",
    summary:
      "Utility-grade builds where the value is obvious without a long sales pitch.",
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
      readmeUrl: "https://github.com/Rohith-AI-HUB/personal-canvas#readme",
      updatedAt: "2026-03-13T13:22:36Z",
      readmeExcerpt:
        "A local-first desktop knowledge canvas for organizing files, searching content, and chatting with your data.",
      lane: "Product Engineering",
      framing:
        "Local-first knowledge canvas for files, search, and chat workflows.",
      note:
        "Featured because the repo reads like a product surface, not a one-screen experiment.",
      proof: ["TypeScript", "README-backed", "Updated Mar 2026"],
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
        "https://github.com/Rohith-AI-HUB/Task_Scheduling_Agent_V2#readme",
      updatedAt: "2026-02-28T15:50:41Z",
      readmeExcerpt:
        "AI-Enhanced Classroom Management System. A production-ready intelligent classroom management platform that combines traditional task management with AI-powered features for scheduling, grouping, evaluation, and student support.",
      lane: "AI Systems",
      framing:
        "AI-enhanced classroom management system for scheduling, grouping, evaluation, and student support.",
      note:
        "Featured because the README defines a multi-step operating surface with clear practical scope.",
      proof: ["Python", "Live demo", "Updated Feb 2026"],
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
      lane: "AI Systems",
      framing:
        "Recommendation engine aimed at university course planning and sequencing.",
      note:
        "Featured because it frames AI as decision support instead of vague assistant branding.",
      proof: ["Python", "Recommendation engine", "Updated Feb 2026"],
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
        "https://github.com/Rohith-AI-HUB/PhysioNetSepsisPrediction#readme",
      updatedAt: "2026-02-16T06:36:35Z",
      readmeExcerpt:
        "This project develops a machine learning system to predict sepsis risk in ICU patients using vital signs and clinical measurements.",
      lane: "AI Systems",
      framing:
        "Machine learning workflow for early sepsis risk detection from ICU data.",
      note:
        "Featured because the public description ties the model work to a concrete healthcare problem.",
      proof: ["Jupyter Notebook", "Healthcare ML", "Updated Feb 2026"],
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
      lane: "Product Engineering",
      framing:
        "Full-stack feedback collection system with separated frontend and backend deployment.",
      note:
        "Featured because it shows practical product wiring beyond a static marketing page.",
      proof: ["JavaScript", "Live demo", "Full-stack workflow"],
    },
    {
      name: "QR_Generator",
      slug: "QR_Generator",
      description: null,
      language: "JavaScript",
      homepage: null,
      repoUrl: "https://github.com/Rohith-AI-HUB/QR_Generator",
      readmeUrl: "https://github.com/Rohith-AI-HUB/QR_Generator#readme",
      updatedAt: "2026-01-19T15:36:52Z",
      readmeExcerpt:
        "A simple and elegant QR code generator that creates QR codes in three different sizes from any website URL.",
      lane: "Practical Tools",
      framing:
        "Small utility for turning URLs into QR outputs at multiple sizes.",
      note:
        "Featured because it is a compact, clear public tool with little narrative inflation.",
      proof: ["JavaScript", "Utility build", "Updated Jan 2026"],
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
  repoCount: 21,
  recentUpdatedAt: "2026-03-24T04:40:41Z",
  contactLinks: CONTACT_LINKS,
  capabilitySummaries: CAPABILITY_SUMMARIES,
};
